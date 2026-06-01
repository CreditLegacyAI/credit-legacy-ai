'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase-client';

export default function SignupPage() {
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isES = locale === 'es';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, locale } },
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
    <div className="min-h-screen flex items-center justify-center bg-offwhite px-4">
      <div className="w-full max-w-md">
        <Link href={`/${locale}`} className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center bg-white">
            <span className="text-gold font-bold">LN</span>
          </div>
          <span className="font-bold text-xl">Credit Legacy AI</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gold/20">
          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📧</div>
              <h2 className="text-2xl font-bold mb-3">
                {isES ? 'Revisa tu correo' : 'Check your email'}
              </h2>
              <p className="text-graydark text-sm">
                {isES
                  ? 'Te enviamos un link de confirmación. Haz clic para activar tu cuenta.'
                  : 'We sent you a confirmation link. Click it to activate your account.'}
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">
                {isES ? 'Crea tu cuenta' : 'Create your account'}
              </h1>
              <p className="text-center text-graydark text-sm mb-8">
                {isES ? 'Comienza tu transformación de crédito' : 'Start your credit transformation'}
              </p>

              <form onSubmit={handleSignup} className="space-y-4">
                <input
                  type="text"
                  placeholder={isES ? 'Nombre completo' : 'Full name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                />
                <input
                  type="email"
                  placeholder={isES ? 'Correo electrónico' : 'Email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                />
                <input
                  type="password"
                  placeholder={isES ? 'Contraseña (mín. 8 caracteres)' : 'Password (min. 8 characters)'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                />

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-dark disabled:opacity-50 text-white py-3 rounded-full font-medium transition-all"
                >
                  {loading
                    ? (isES ? 'Creando...' : 'Creating...')
                    : (isES ? 'Crear Cuenta' : 'Create Account')}
                </button>
              </form>

              <p className="text-center text-sm text-graydark mt-6">
                {isES ? '¿Ya tienes cuenta?' : 'Already have an account?'}{' '}
                <Link href={`/${locale}/auth/login`} className="text-gold font-medium hover:underline">
                  {isES ? 'Inicia sesión' : 'Sign in'}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
