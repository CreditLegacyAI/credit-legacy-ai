import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { askClaude } from '@/lib/anthropic';
import { SYSTEM_PROMPTS, USER_PROMPTS } from '@/lib/prompts';

/**
 * Endpoint para correr Smart Audit en un reporte de crédito.
 *
 * Phase 1: Acepta un reporte simulado (mock data).
 * Phase 2: Integrará con Array API para pulls reales.
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { creditReport, locale = 'es' } = await request.json();

    if (!creditReport) {
      return NextResponse.json({ error: 'Reporte requerido' }, { status: 400 });
    }

    // Llamar a Claude con el prompt del Smart Audit
    const analysis = await askClaude({
      system: SYSTEM_PROMPTS.smartAudit,
      prompt: USER_PROMPTS.smartAudit(creditReport, locale),
      maxTokens: 4096,
      locale,
    });

    // Guardar el audit en la base de datos
    const { data: auditRecord, error: dbError } = await supabase
      .from('audits')
      .insert([
        {
          user_id: user.id,
          analysis,
          locale,
          status: 'completed',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('DB error:', dbError);
    }

    return NextResponse.json({
      success: true,
      analysis,
      auditId: auditRecord?.id,
    });
  } catch (err) {
    console.error('Smart Audit error:', err);
    return NextResponse.json({ error: 'Error en el análisis' }, { status: 500 });
  }
}
