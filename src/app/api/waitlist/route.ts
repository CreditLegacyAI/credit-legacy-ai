import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { waitlistSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, name, locale } = parsed.data;
    const supabase = createClient();

    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, name, locale, signed_up_at: new Date().toISOString() }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ code: 'duplicate' }, { status: 409 });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
