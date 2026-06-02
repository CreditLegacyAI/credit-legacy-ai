import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { parsePDF, normalizeText } from '@/lib/pdf-parser';
import { detectReport, type BureauName } from '@/lib/credit-report-detector';
import { structureReport, type StructuredCreditReport } from '@/lib/credit-report-structurer';
import { analyzeStructuredReport } from '@/lib/audit-analyzer';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for full analysis

/**
 * Analyze endpoint.
 *
 * Workflow:
 *   1. Validate auth + audit ownership
 *   2. Download all PDF files from Storage
 *   3. Parse each PDF (extract text)
 *   4. Detect bureaus + scores
 *   5. Structure into JSON
 *   6. Send to Claude for analysis
 *   7. Save disputable items to DB
 *   8. Update audit status to 'completed'
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse body
    const { auditId } = await request.json();
    if (!auditId) {
      return NextResponse.json({ error: 'auditId required' }, { status: 400 });
    }

    // Verify audit ownership
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .eq('user_id', user.id)
      .single();

    if (auditError || !audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    if (audit.status === 'completed') {
      return NextResponse.json({ error: 'Audit already completed' }, { status: 400 });
    }

    // Get all audit files
    const { data: files, error: filesError } = await supabase
      .from('audit_files')
      .select('*')
      .eq('audit_id', auditId);

    if (filesError || !files || files.length === 0) {
      return NextResponse.json({ error: 'No files found for audit' }, { status: 404 });
    }

    // Update status to parsing
    await supabase.from('audits').update({ status: 'parsing' }).eq('id', auditId);

    // --- Step 1: Parse all PDFs ---
    const parsedFiles: Array<{
      fileId: string;
      text: string;
      pageCount: number;
    }> = [];

    for (const file of files) {
      try {
        // Download from storage
        const { data: blob, error: downloadError } = await supabase.storage
          .from('credit-reports')
          .download(file.storage_path);

        if (downloadError || !blob) {
          throw new Error(`Failed to download ${file.storage_path}`);
        }

        // Convert to Buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse PDF
        const parsed = await parsePDF(buffer);
        const normalized = normalizeText(parsed.text);

        // Update audit_files record
        await supabase
          .from('audit_files')
          .update({
            page_count: parsed.pageCount,
            raw_text: normalized.length > 1000000 ? normalized.substring(0, 1000000) : normalized,
            parse_status: 'completed',
            parsed_at: new Date().toISOString(),
          })
          .eq('id', file.id);

        parsedFiles.push({
          fileId: file.id,
          text: normalized,
          pageCount: parsed.pageCount,
        });
      } catch (err) {
        console.error(`Parse error for file ${file.id}:`, err);
        await supabase
          .from('audit_files')
          .update({
            parse_status: 'failed',
            parse_error: err instanceof Error ? err.message : 'Unknown error',
          })
          .eq('id', file.id);
      }
    }

    if (parsedFiles.length === 0) {
      await supabase
        .from('audits')
        .update({
          status: 'failed',
          error_message: 'Failed to parse any PDF files',
        })
        .eq('id', auditId);
      return NextResponse.json({ error: 'Failed to parse PDFs' }, { status: 500 });
    }

    // --- Step 2: Detect & combine bureaus ---
    const allBureaus = new Set<BureauName>();
    const combinedScores = {
      equifax: undefined as number | undefined,
      experian: undefined as number | undefined,
      transunion: undefined as number | undefined,
    };
    let combinedText = '';
    let reportDate: string | undefined;
    let reportType: 'myfico_3b' | 'single_bureau' | 'multi_bureau' = 'single_bureau';

    for (const pf of parsedFiles) {
      const detection = detectReport(pf.text);
      detection.bureaus.forEach((b) => allBureaus.add(b));

      if (detection.scores.equifax) combinedScores.equifax = detection.scores.equifax;
      if (detection.scores.experian) combinedScores.experian = detection.scores.experian;
      if (detection.scores.transunion) combinedScores.transunion = detection.scores.transunion;

      if (detection.reportDate && !reportDate) reportDate = detection.reportDate;
      if (detection.source === 'myfico_3b') reportType = 'myfico_3b';

      // Update file's detected bureau
      const fileBureau =
        detection.source === 'myfico_3b'
          ? 'myfico_3b'
          : detection.bureaus.length === 1
          ? detection.bureaus[0]
          : 'unknown';

      await supabase.from('audit_files').update({ detected_bureau: fileBureau }).eq('id', pf.fileId);

      combinedText += `\n\n--- FILE: ${detection.source} ---\n${pf.text}`;
    }

    if (allBureaus.size > 1 && reportType !== 'myfico_3b') {
      reportType = 'multi_bureau';
    }

    // --- Step 3: Structure into JSON ---
    const structured: StructuredCreditReport = structureReport(
      combinedText,
      Array.from(allBureaus),
      combinedScores,
      reportDate
    );

    // Save raw JSON
    await supabase
      .from('audits')
      .update({
        status: 'analyzing',
        report_type: reportType,
        bureaus_included: Array.from(allBureaus),
        score_equifax: combinedScores.equifax || null,
        score_experian: combinedScores.experian || null,
        score_transunion: combinedScores.transunion || null,
        report_date: reportDate || null,
        total_accounts: structured.meta.totalAccounts,
        raw_extracted_json: structured,
      })
      .eq('id', auditId);

    // --- Step 4: Send to Claude ---
    let analysis;
    try {
      analysis = await analyzeStructuredReport(structured);
    } catch (err) {
      console.error('Claude analysis error:', err);
      await supabase
        .from('audits')
        .update({
          status: 'failed',
          error_message:
            err instanceof Error ? err.message : 'AI analysis failed',
        })
        .eq('id', auditId);
      return NextResponse.json(
        { error: 'AI analysis failed', details: err instanceof Error ? err.message : 'Unknown' },
        { status: 500 }
      );
    }

    // --- Step 5: Save disputable items ---
    if (analysis.disputableItems && analysis.disputableItems.length > 0) {
      const itemRows = analysis.disputableItems.map((item) => ({
        audit_id: auditId,
        user_id: user.id,
        category: item.category,
        priority: item.priority,
        estimated_score_impact: item.estimatedScoreImpact || null,
        affected_bureaus: item.affectedBureaus || [],
        creditor_name: item.creditorName || null,
        account_number_masked: item.accountNumberMasked || null,
        account_type: item.accountType || null,
        description_es: item.descriptionEs,
        description_en: item.descriptionEn,
        legal_basis: item.legalBasis,
        recommended_round: item.recommendedRound,
        raw_data: item.rawData || null,
      }));

      const { error: itemsError } = await supabase.from('disputable_items').insert(itemRows);
      if (itemsError) {
        console.error('Disputable items insert error:', itemsError);
      }
    }

    // --- Step 6: Mark audit as completed ---
    await supabase
      .from('audits')
      .update({
        status: 'completed',
        ai_analysis_json: analysis as unknown as Record<string, unknown>,
        executive_summary_es: analysis.executiveSummaryEs,
        executive_summary_en: analysis.executiveSummaryEn,
        total_disputable_items: analysis.disputableItems?.length || 0,
        claude_input_tokens: analysis.tokenUsage.input,
        claude_output_tokens: analysis.tokenUsage.output,
        estimated_cost_usd: analysis.tokenUsage.estimatedCostUsd,
        completed_at: new Date().toISOString(),
      })
      .eq('id', auditId);

    return NextResponse.json({
      success: true,
      auditId,
      summary: {
        totalDisputableItems: analysis.disputableItems?.length || 0,
        bureaus: Array.from(allBureaus),
        scores: combinedScores,
        estimatedScoreImpact: analysis.estimatedTotalScoreImpact,
      },
    });
  } catch (err) {
    console.error('Analyze API error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 }
    );
  }
}
