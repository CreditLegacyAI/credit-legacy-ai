'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase-client';
import { Mail, Lock, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'password' | 'magicLink'>('password');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      window.location.href = `/${locale}/dashboard`;
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/${locale}/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setMagicLinkSent(true);
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
          {magicLinkSent ? (
            <div className="text-center py-8">
              <Mail className="w-16 h-16 text-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">{t('verifyTitle')}</h2>
              <p className="text-graydark text-sm">{t('verifyMessage')}</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">{t('loginTitle')}</h1>
              <p className="text-center text-graydark text-sm mb-8">{t('loginSubtitle')}</p>

              <form
                onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink}
                className="space-y-4"
              >
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

                {mode === 'password' && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" />
                    <input
                      type="password"
                      placeholder={t('password')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                    />
                  </div>
                )}

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-dark disabled:opacity-50 text-white py-3 rounded-full font-medium transition-all"
                >
                  {loading
                    ? t('signingIn')
                    : mode === 'password'
                      ? t('signIn')
                      : t('magicLink')}
                </button>

                {mode === 'password' && (
                  <Link
                    href={`/${locale}/auth/forgot-password`}
                    className="block text-center text-sm text-graydark hover:text-gold transition-colors"
                  >
                    {t('forgotPassword')}
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setMode(mode === 'password' ? 'magicLink' : 'password')}
                  className="w-full text-sm text-gold hover:text-gold-dark flex items-center justify-center gap-2 pt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {mode === 'password' ? t('useMagicLink') : t('usePassword')}
                </button>
              </form>

              <p className="text-center text-sm text-graydark mt-6">
                {t('noAccount')}{' '}
                <Link
                  href={`/${locale}/auth/signup`}
                  className="text-gold font-medium hover:underline"
                >
                  {t('signUp')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
