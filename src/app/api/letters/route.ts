import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { askClaude } from '@/lib/anthropic';
import { SYSTEM_PROMPTS } from '@/lib/prompts';

/**
 * Genera una carta de disputa FCRA en formato personal de consumidor.
 *
 * IMPORTANTE: Las cartas DEBEN:
 * - Estar en inglés (formato legal estándar US)
 * - Apariencia de carta personal (NO corporativa)
 * - Times New Roman 12pt cuando se exporten
 * - Solicitar "manual investigation, NOT e-OSCAR"
 * - Una carta por disputed item
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { disputedItem, bureau, consumerInfo } = await request.json();

    if (!disputedItem || !bureau || !consumerInfo) {
      return NextResponse.json(
        { error: 'Datos incompletos para generar carta' },
        { status: 400 }
      );
    }

    // Prompt específico para generar la carta
    const letterPrompt = `Generate a FCRA dispute letter in English with these details:

Consumer Information:
- Name: ${consumerInfo.fullName}
- Address: ${consumerInfo.address}
- Date of Birth: ${consumerInfo.dateOfBirth}
- Last 4 SSN/ITIN: ${consumerInfo.last4}

Bureau: ${bureau}

Disputed Item:
${JSON.stringify(disputedItem, null, 2)}

REQUIREMENTS:
- Format as personal consumer letter (NOT corporate)
- Include explicit request for "manual investigation, NOT e-OSCAR"
- Cite FCRA Section 611(a)(1)(A) in bold with § symbol
- Request response within 30 days
- Professional but assertive tone
- No threats or aggressive language`;

    const letterContent = await askClaude({
      system: SYSTEM_PROMPTS.letterGenerator,
      prompt: letterPrompt,
      maxTokens: 2048,
      locale: 'en',
    });

    // Guardar la letter en DB
    const { data: letterRecord, error: dbError } = await supabase
      .from('letters')
      .insert([
        {
          user_id: user.id,
          bureau,
          disputed_item: disputedItem,
          content: letterContent,
          status: 'draft',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('DB error:', dbError);
    }

    return NextResponse.json({
      success: true,
      content: letterContent,
      letterId: letterRecord?.id,
    });
  } catch (err) {
    console.error('Letter generation error:', err);
    return NextResponse.json({ error: 'Error generando carta' }, { status: 500 });
  }
}
