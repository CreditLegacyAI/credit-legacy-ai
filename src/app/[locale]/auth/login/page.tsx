'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isES = locale === 'es';

  const handleLogin = async (e: React.FormEvent) => {
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
          <h1 className="text-2xl font-bold text-center mb-2">
            {isES ? 'Bienvenido de vuelta' : 'Welcome back'}
          </h1>
          <p className="text-center text-graydark text-sm mb-8">
            {isES ? 'Inicia sesión en tu cuenta' : 'Sign in to your account'}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder={isES ? 'Contraseña' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
            />

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-dark disabled:opacity-50 text-white py-3 rounded-full font-medium transition-all"
            >
              {loading ? (isES ? 'Entrando...' : 'Signing in...') : (isES ? 'Iniciar Sesión' : 'Sign In')}
            </button>
          </form>

          <p className="text-center text-sm text-graydark mt-6">
            {isES ? '¿No tienes cuenta?' : "Don't have an account?"}{' '}
            <Link href={`/${locale}/auth/signup`} className="text-gold font-medium hover:underline">
              {isES ? 'Regístrate' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
