'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Home, Mail } from 'lucide-react';

export default function NotFound() {
  // Note: next-intl's useLocale may not work in not-found.tsx in all setups
  // Fallback to 'es' if locale detection fails
  let locale = 'es';
  try {
    locale = useLocale();
  } catch {
    locale = 'es';
  }

  const isEs = locale === 'es';

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
          <div className="text-8xl md:text-9xl font-bold text-gradient-gold mb-4 leading-none">
            404
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">
            {isEs ? 'Página no encontrada' : 'Page not found'}
          </h1>
          <p className="text-graydark mb-8">
            {isEs
              ? 'Parece que esta página no existe o fue movida.'
              : 'It seems this page doesn\'t exist or was moved.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Home className="w-4 h-4" />
              {isEs ? 'Volver al Inicio' : 'Back to Home'}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 border-2 border-gold text-gold hover:bg-gold hover:text-white px-6 py-3 rounded-full font-medium transition-all"
            >
              <Mail className="w-4 h-4" />
              {isEs ? 'Contactar Soporte' : 'Contact Support'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
