import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, name, locale } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, name, locale, signed_up_at: new Date().toISOString() }]);

    if (error) {
      // Postgres unique violation
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
