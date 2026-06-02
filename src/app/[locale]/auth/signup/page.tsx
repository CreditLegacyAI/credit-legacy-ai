'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase-client';
import { Mail, Lock, User, PartyPopper } from 'lucide-react';

export default function SignupPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, locale },
        emailRedirectTo: `${window.location.origin}/${locale}/onboarding`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
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
          {success ? (
            <div className="text-center py-8">
              <PartyPopper className="w-16 h-16 text-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">{t('verifyTitle')}</h2>
              <p className="text-graydark text-sm">{t('verifyMessage')}</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">{t('signupTitle')}</h1>
              <p className="text-center text-graydark text-sm mb-8">{t('signupSubtitle')}</p>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" />
                  <input
                    type="text"
                    placeholder={t('fullName')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                  />
                </div>

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

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" />
                  <input
                    type="password"
                    placeholder={t('passwordHint')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
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
                  {loading ? t('creating') : t('signUp')}
                </button>

                <p className="text-xs text-center text-graydark">
                  {t('termsAgree')}{' '}
                  <Link href={`/${locale}/legal/terms`} className="text-gold hover:underline">
                    {t('termsLink')}
                  </Link>{' '}
                  {t('and')}{' '}
                  <Link href={`/${locale}/legal/privacy`} className="text-gold hover:underline">
                    {t('privacyLink')}
                  </Link>
                  .
                </p>
              </form>

              <p className="text-center text-sm text-graydark mt-6">
                {t('alreadyHaveAccount')}{' '}
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-gold font-medium hover:underline"
                >
                  {t('signIn')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
