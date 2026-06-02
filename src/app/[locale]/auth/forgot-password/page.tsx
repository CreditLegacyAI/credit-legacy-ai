'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase-client';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/auth/login`,
    });

    if (authError) {
      setError(authError.message);
    } else {
      // Always show "sent" message even if email doesn't exist (security)
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite px-4 py-12">
      <div className="w-full max-w-md">
        <Link href={`/${locale}`} className="flex items-center justify-center gap-3 mb-8">
          <Image
            src="/logo.png"
            alt="Credit Legacy AI"
            width={48}
            height={48}
            priority
            className="w-12 h-12 object-contain"
          />
          <span className="font-bold text-xl">Credit Legacy AI</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gold/20">
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">{t('forgotSentTitle')}</h2>
              <p className="text-graydark text-sm mb-6">{t('forgotSentMessage')}</p>
              <Link
                href={`/${locale}/auth/login`}
                className="inline-flex items-center gap-2 text-gold hover:text-gold-dark"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToLogin')}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">{t('forgotTitle')}</h1>
              <p className="text-center text-graydark text-sm mb-8">{t('forgotSubtitle')}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" />
                  <input
                    type="email"
                    placeholder={t('email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                  />
                </div>

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-dark disabled:opacity-50 text-white py-3 rounded-full font-medium transition-all"
                >
                  {loading ? t('sending') : t('sendResetLink')}
                </button>
              </form>

              <Link
                href={`/${locale}/auth/login`}
                className="mt-6 flex items-center justify-center gap-2 text-sm text-graydark hover:text-gold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToLogin')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
