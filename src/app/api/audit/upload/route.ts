import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for upload

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_FILES = 3;
const ALLOWED_MIME_TYPES = ['application/pdf'];

/**
 * Upload endpoint for credit report PDFs.
 *
 * Workflow:
 *   1. Validate auth
 *   2. Check user hasn't run audit in last 30 days (rate limit)
 *   3. Create audit record
 *   4. Upload PDFs to Supabase Storage
 *   5. Create audit_files records
 *   6. Return audit ID for client to trigger analysis
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 1 audit per 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentAudits } = await supabase
      .from('audits')
      .select('id, created_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false })
      .limit(1);

    if (recentAudits && recentAudits.length > 0) {
      const lastAudit = new Date(recentAudits[0].created_at);
      const daysAgo = Math.floor((Date.now() - lastAudit.getTime()) / (24 * 60 * 60 * 1000));
      const daysRemaining = 30 - daysAgo;
      return NextResponse.json(
        {
          error: 'rate_limit',
          message: `Ya completaste un audit en los últimos 30 días. Puedes hacer otro en ${daysRemaining} día${daysRemaining === 1 ? '' : 's'}.`,
          daysRemaining,
        },
        { status: 429 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Máximo ${MAX_FILES} archivos por audit` },
        { status: 400 }
      );
    }

    // Validate each file
    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Solo se permiten archivos PDF. Recibido: ${file.type}` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `Archivo "${file.name}" excede el límite de 20MB`,
          },
          { status: 400 }
        );
      }
    }

    // Create audit record
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .insert({
        user_id: user.id,
        status: 'pending',
      })
      .select()
      .single();

    if (auditError || !audit) {
      console.error('Audit creation error:', auditError);
      return NextResponse.json({ error: 'Failed to create audit' }, { status: 500 });
    }

    // Upload each file to Supabase Storage
    const uploadedFiles: Array<{
      id: string;
      storage_path: string;
      original_filename: string;
      file_size_bytes: number;
    }> = [];

    for (const file of files) {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${user.id}/${audit.id}/${timestamp}-${safeName}`;

      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from('credit-reports')
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        // Rollback: delete the audit
        await supabase.from('audits').delete().eq('id', audit.id);
        return NextResponse.json(
          { error: 'Error al subir archivo. Intenta de nuevo.' },
          { status: 500 }
        );
      }

      // Create audit_files record
      const { data: auditFile, error: fileError } = await supabase
        .from('audit_files')
        .insert({
          audit_id: audit.id,
          storage_path: storagePath,
          original_filename: file.name,
          file_size_bytes: file.size,
          mime_type: file.type,
          parse_status: 'pending',
        })
        .select()
        .single();

      if (fileError || !auditFile) {
        console.error('Audit file insert error:', fileError);
        continue;
      }

      uploadedFiles.push({
        id: auditFile.id,
        storage_path: storagePath,
        original_filename: file.name,
        file_size_bytes: file.size,
      });
    }

    if (uploadedFiles.length === 0) {
      // Rollback
      await supabase.from('audits').delete().eq('id', audit.id);
      return NextResponse.json({ error: 'No files were uploaded successfully' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      auditId: audit.id,
      filesUploaded: uploadedFiles.length,
      files: uploadedFiles.map((f) => ({
        id: f.id,
        name: f.original_filename,
        size: f.file_size_bytes,
      })),
    });
  } catch (err) {
    console.error('Upload API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
