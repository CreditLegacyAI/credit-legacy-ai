'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

export default function VerifyPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite px-4 py-12">
      <div className="w-full max-w-md">
        <Link href={`/${locale}`} className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center bg-white">
            <span className="text-gold font-bold">LN</span>
          </div>
          <span className="font-bold text-xl">Credit Legacy AI</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gold/20 text-center">
          <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-3">
            {locale === 'es' ? '¡Cuenta verificada!' : 'Account verified!'}
          </h1>
          <p className="text-graydark mb-6">
            {locale === 'es'
              ? 'Tu correo ha sido confirmado. Ya puedes acceder al dashboard.'
              : 'Your email has been confirmed. You can now access the dashboard.'}
          </p>
          <Link
            href={`/${locale}/dashboard`}
            className="inline-block bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full font-medium transition-all"
          >
            {locale === 'es' ? 'Ir al Dashboard' : 'Go to Dashboard'}
          </Link>
        </div>
      </div>
    </div>
  );
}
