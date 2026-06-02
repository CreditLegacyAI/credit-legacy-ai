import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
  locale: z.enum(['es', 'en']).default('es'),
});

/**
 * Contact form endpoint.
 * Phase 1: Guarda en tabla `contact_messages` para review manual.
 * Phase 2: Auto-forward a hello@creditlegacy.ai via Resend.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message, locale } = parsed.data;
    const supabase = createClient();

    const { error } = await supabase.from('contact_messages').insert([
      {
        name,
        email,
        subject,
        message,
        locale,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
