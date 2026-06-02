'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const locale = useLocale();
  const isES = locale === 'es';

  return (
    <div className="min-h-screen bg-offwhite py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-gold hover:text-gold-dark mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {isES ? 'Volver al inicio' : 'Back to home'}
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gold/20">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            {isES ? 'Política de Privacidad' : 'Privacy Policy'}
          </h1>
          <p className="text-sm text-graydark mb-8">
            {isES ? 'Última actualización: 31 de mayo de 2026' : 'Last updated: May 31, 2026'}
          </p>

          <div className="prose prose-sm max-w-none text-graydark space-y-6">
            <p>
              {isES
                ? 'Tu privacidad es fundamental para nosotros. Esta política explica qué datos recopilamos, cómo los usamos y cómo los protegemos.'
                : 'Your privacy is fundamental to us. This policy explains what data we collect, how we use it and how we protect it.'}
            </p>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                1. {isES ? 'Datos que Recopilamos' : 'Data We Collect'}
              </h2>
              <ul className="space-y-2">
                <li>• {isES ? 'Información de identidad: nombre, email, fecha de nacimiento' : 'Identity info: name, email, date of birth'}</li>
                <li>• {isES ? 'Identificación tributaria: SSN o ITIN (cifrado AES-256)' : 'Tax ID: SSN or ITIN (AES-256 encrypted)'}</li>
                <li>• {isES ? 'Dirección y teléfono' : 'Address and phone'}</li>
                <li>• {isES ? 'Reportes de crédito que decidas conectar' : 'Credit reports you choose to connect'}</li>
                <li>• {isES ? 'Información de pago (procesada por Stripe)' : 'Payment info (processed by Stripe)'}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                2. {isES ? 'Cómo Protegemos tus Datos' : 'How We Protect Your Data'}
              </h2>
              <ul className="space-y-2">
                <li>• {isES ? 'Cifrado AES-256 at-rest y en tránsito' : 'AES-256 encryption at-rest and in transit'}</li>
                <li>• 2FA {isES ? 'opcional para usuarios' : 'optional for users'}</li>
                <li>• Row Level Security (RLS) {isES ? 'en database' : 'in database'}</li>
                <li>• {isES ? 'Audit logs de toda actividad sensible' : 'Audit logs of all sensitive activity'}</li>
                <li>• {isES ? 'HTTPS obligatorio' : 'Mandatory HTTPS'}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                3. {isES ? 'No Vendemos tu Información' : 'We Do NOT Sell Your Information'}
              </h2>
              <p>
                {isES
                  ? 'Nunca venderemos, alquilaremos ni intercambiaremos tus datos con terceros para fines comerciales. Punto final.'
                  : "We will never sell, rent or trade your data with third parties for commercial purposes. Period."}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                4. {isES ? 'Tus Derechos' : 'Your Rights'}
              </h2>
              <ul className="space-y-2">
                <li>• {isES ? 'Acceder a todos tus datos' : 'Access all your data'}</li>
                <li>• {isES ? 'Solicitar corrección o eliminación' : 'Request correction or deletion'}</li>
                <li>• {isES ? 'Exportar tu información en formato portable' : 'Export your information in portable format'}</li>
                <li>• {isES ? 'Cancelar tu cuenta en cualquier momento' : 'Cancel your account anytime'}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                5. {isES ? 'Retención' : 'Retention'}
              </h2>
              <p>
                {isES
                  ? 'Mantenemos tus datos mientras tengas cuenta activa. Al cancelar completamente, eliminamos tus datos en 30 días (excepto lo requerido por ley FCRA).'
                  : 'We keep your data while you have an active account. Upon complete cancellation, we delete your data in 30 days (except as required by FCRA law).'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                6. {isES ? 'Contacto' : 'Contact'}
              </h2>
              <p>
                {isES ? 'Para temas de privacidad:' : 'For privacy matters:'}{' '}
                <a href="mailto:security@creditlegacy.ai" className="text-gold hover:underline">
                  security@creditlegacy.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
