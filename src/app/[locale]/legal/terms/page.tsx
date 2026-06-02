'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            {isES ? 'Términos de Servicio' : 'Terms of Service'}
          </h1>
          <p className="text-sm text-graydark mb-8">
            {isES ? 'Última actualización: 31 de mayo de 2026' : 'Last updated: May 31, 2026'}
          </p>

          <div className="prose prose-sm max-w-none text-graydark space-y-6">
            <p>
              {isES
                ? 'Bienvenido a Credit Legacy AI, una división de Nieves Legacy Partners LLC. Al usar nuestra plataforma, aceptas estos términos.'
                : 'Welcome to Credit Legacy AI, a division of Nieves Legacy Partners LLC. By using our platform, you accept these terms.'}
            </p>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                1. {isES ? 'Servicio DIY' : 'DIY Service'}
              </h2>
              <p>
                {isES
                  ? 'Credit Legacy AI es una plataforma DIY (Do It Yourself) con inteligencia artificial. NO somos una compañía de reparación de crédito tradicional ni un proveedor de servicios legales.'
                  : 'Credit Legacy AI is a DIY (Do It Yourself) platform with artificial intelligence. We are NOT a traditional credit repair company nor a legal service provider.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                2. {isES ? 'FCRA Compliance' : 'FCRA Compliance'}
              </h2>
              <p>
                {isES
                  ? 'Cumplimos con el Fair Credit Reporting Act (FCRA), Credit Repair Organizations Act (CROA) y todas las regulaciones estatales aplicables.'
                  : 'We comply with the Fair Credit Reporting Act (FCRA), Credit Repair Organizations Act (CROA) and all applicable state regulations.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                3. {isES ? 'CPN Prohibido' : 'CPN Prohibited'}
              </h2>
              <p>
                {isES
                  ? 'Usar un CPN (Credit Profile Number) en lugar de tu SSN es ilegal bajo FCRA. Rechazamos automáticamente cualquier intento. Aceptamos SSN o ITIN válidos del IRS.'
                  : 'Using a CPN (Credit Profile Number) instead of your SSN is illegal under FCRA. We automatically reject any attempts. We accept valid SSN or ITIN from IRS.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                4. {isES ? 'Sin Promesas de Resultados' : 'No Results Promises'}
              </h2>
              <p>
                {isES
                  ? 'No garantizamos un aumento específico en tu credit score ni resultados en tiempos específicos. Cada caso es único.'
                  : 'We do not guarantee a specific increase in your credit score or results in specific timeframes. Every case is unique.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                5. {isES ? 'Cancelación' : 'Cancellation'}
              </h2>
              <p>
                {isES
                  ? 'Puedes cancelar tu plan en cualquier momento. Al cancelar, automáticamente bajas al plan Monitoring ($9.99/mo) que mantiene tu crédito vigilado, o puedes salir completamente con un click.'
                  : 'You can cancel your plan at any time. Upon cancellation, you automatically downgrade to the Monitoring plan ($9.99/mo) that keeps your credit watched, or you can leave completely with one click.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mt-6 mb-3">
                6. {isES ? 'Contacto' : 'Contact'}
              </h2>
              <p>
                {isES ? 'Para dudas legales:' : 'For legal questions:'}{' '}
                <a href="mailto:legal@creditlegacy.ai" className="text-gold hover:underline">
                  legal@creditlegacy.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
