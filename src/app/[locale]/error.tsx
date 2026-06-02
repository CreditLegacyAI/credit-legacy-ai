'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  let locale = 'es';
  try {
    locale = useLocale();
  } catch {
    locale = 'es';
  }

  const isEs = locale === 'es';

  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-12">
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

        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gold/20">
          <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">
            {isEs ? 'Algo salió mal' : 'Something went wrong'}
          </h1>
          <p className="text-graydark mb-8">
            {isEs
              ? 'Encontramos un error inesperado. Estamos trabajando en arreglarlo.'
              : 'We encountered an unexpected error. We\'re working on fixing it.'}
          </p>

          {error.digest && (
            <p className="text-xs text-graydark/60 mb-6 font-mono">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              {isEs ? 'Intentar de Nuevo' : 'Try Again'}
            </button>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center gap-2 border-2 border-gold text-gold hover:bg-gold hover:text-white px-6 py-3 rounded-full font-medium transition-all"
            >
              <Home className="w-4 h-4" />
              {isEs ? 'Volver al Inicio' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
