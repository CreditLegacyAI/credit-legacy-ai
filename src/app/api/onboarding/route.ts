import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { detectCPN } from '@/lib/validation';
import { encrypt, maskTaxId } from '@/lib/crypto';

/**
 * Onboarding endpoint.
 * Recibe datos del wizard, valida, cifra el SSN/ITIN, y guarda en profiles.
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

    const body = await request.json();
    const {
      legalName,
      dob,
      phone,
      street,
      city,
      state,
      zip,
      taxIdType,
      taxId,
    } = body;

    // Validar CPN (CRÍTICO)
    if (taxId && detectCPN(taxId)) {
      return NextResponse.json(
        {
          error:
            'Este número parece ser un CPN. Los CPN son ilegales bajo FCRA. Solo aceptamos SSN o ITIN válidos.',
          code: 'CPN_DETECTED',
        },
        { status: 400 }
      );
    }

    // Cifrar tax ID si está presente
    let taxIdEncrypted: string | null = null;
    let taxIdLast4: string | null = null;
    if (taxId) {
      try {
        taxIdEncrypted = await encrypt(taxId.replace(/[\s-]/g, ''));
        taxIdLast4 = taxId.replace(/[\s-]/g, '').slice(-4);
      } catch (err) {
        console.error('Encryption error:', err);
        return NextResponse.json(
          { error: 'Error al cifrar datos. Contacta soporte.' },
          { status: 500 }
        );
      }
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: legalName || undefined,
        date_of_birth: dob || undefined,
        phone: phone || undefined,
        address: {
          street,
          city,
          state,
          zip,
        },
        tax_id_encrypted: taxIdEncrypted,
        tax_id_type: taxIdType,
        tax_id_last4: taxIdLast4,
        kyc_completed: !!(legalName && dob && taxIdEncrypted),
        kyc_completed_at: taxIdEncrypted ? new Date().toISOString() : null,
        onboarding_completed: true,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json({ error: 'Error guardando datos' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Onboarding API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
