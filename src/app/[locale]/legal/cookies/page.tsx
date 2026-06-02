'use client';

import { useLocale } from 'next-intl';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function CookiesPage() {
  const locale = useLocale();
  const isEs = locale === 'es';

  return (
    <>
      <Navbar />
      <main className="bg-offwhite py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-md border border-gold/20">
            <p className="text-xs text-gold uppercase tracking-wider font-medium mb-2">
              {isEs ? 'Última actualización' : 'Last updated'}: {isEs ? 'Junio 2026' : 'June 2026'}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
              {isEs ? 'Política de Cookies' : 'Cookie Policy'}
            </h1>

            {isEs ? (
              <div className="prose prose-lg max-w-none text-graydark space-y-6">
                <p>
                  Esta Política de Cookies explica qué son las cookies y cómo las usamos en{' '}
                  <strong>Credit Legacy AI</strong>, una división de Nieves Legacy Partners LLC.
                  Al usar nuestro sitio web, aceptas el uso de cookies de acuerdo con esta política.
                </p>

                <h2 className="text-xl font-bold text-black mt-8">1. ¿Qué son las Cookies?</h2>
                <p>
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando
                  visitas un sitio web. Permiten que el sitio recuerde tus acciones y preferencias
                  (como idioma, sesión, configuración) durante un período de tiempo.
                </p>

                <h2 className="text-xl font-bold text-black mt-8">2. Tipos de Cookies que Usamos</h2>

                <h3 className="text-lg font-bold text-gold mt-6">Cookies Esenciales</h3>
                <p>
                  Son necesarias para el funcionamiento del sitio. Permiten autenticación, seguridad,
                  y manejo de sesión. Sin estas cookies, no podrías iniciar sesión ni usar funciones
                  protegidas. <strong>No se pueden desactivar.</strong>
                </p>

                <h3 className="text-lg font-bold text-gold mt-6">Cookies de Preferencias</h3>
                <p>
                  Almacenan tus preferencias de idioma (español/inglés) y configuración personal.
                  Mejoran tu experiencia recordando tus elecciones.
                </p>

                <h3 className="text-lg font-bold text-gold mt-6">Cookies de Análisis</h3>
                <p>
                  Nos ayudan a entender cómo los usuarios interactúan con el sitio (páginas más
                  visitadas, tiempo en cada sección). Toda la información es anónima y agregada. No
                  vendemos esta información a terceros.
                </p>

                <h3 className="text-lg font-bold text-gold mt-6">Cookies de Marketing</h3>
                <p>
                  Solo si has dado consentimiento explícito. Se usan para mostrar contenido relevante
                  basado en tu interés. Puedes desactivarlas en cualquier momento.
                </p>

                <h2 className="text-xl font-bold text-black mt-8">3. Cookies de Terceros</h2>
                <p>
                  Algunos servicios que usamos pueden establecer sus propias cookies:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Supabase</strong>: Para autenticación y manejo de sesión</li>
                  <li><strong>Vercel Analytics</strong>: Para métricas de rendimiento (anónimas)</li>
                  <li><strong>Anthropic</strong>: Para funcionalidad de AI (sin cookies persistentes)</li>
                </ul>

                <h2 className="text-xl font-bold text-black mt-8">4. ¿Cómo Controlar las Cookies?</h2>
                <p>
                  Tienes varias opciones para controlar las cookies:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Aceptar o rechazar el banner de cookies cuando aparezca</li>
                  <li>Configurar tu navegador para bloquear cookies (puede afectar funcionalidad)</li>
                  <li>Eliminar cookies existentes desde la configuración de tu navegador</li>
                  <li>Usar modo de navegación privada/incógnito</li>
                </ul>

                <h2 className="text-xl font-bold text-black mt-8">5. Tus Derechos</h2>
                <p>
                  Como usuario, tienes derecho a:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Saber qué cookies usamos y para qué</li>
                  <li>Revocar tu consentimiento en cualquier momento</li>
                  <li>Solicitar la eliminación de tus datos personales asociados</li>
                  <li>Acceder a información sobre cómo procesamos tus datos</li>
                </ul>

                <h2 className="text-xl font-bold text-black mt-8">6. Cambios en esta Política</h2>
                <p>
                  Podemos actualizar esta política periódicamente. Cuando lo hagamos, actualizaremos
                  la fecha de &ldquo;Última actualización&rdquo; al inicio. Te recomendamos revisarla
                  ocasionalmente.
                </p>

                <h2 className="text-xl font-bold text-black mt-8">7. Contacto</h2>
                <p>
                  Si tienes preguntas sobre nuestro uso de cookies, contáctanos en:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Email: <a href="mailto:privacy@creditlegacy.ai" className="text-gold hover:underline">privacy@creditlegacy.ai</a></li>
                  <li>Soporte: <a href="mailto:hello@creditlegacy.ai" className="text-gold hover:underline">hello@creditlegacy.ai</a></li>
                </ul>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none text-graydark space-y-6">
                <p>
                  This Cookie Policy explains what cookies are and how we use them at{' '}
                  <strong>Credit Legacy AI</strong>, a division of Nieves Legacy Partners LLC. By
                  using our website, you accept the use of cookies in accordance with this policy.
                </p>

                <h2 className="text-xl font-bold text-black mt-8">1. What are Cookies?</h2>
                <p>
                  Cookies are small text files stored on your device when you visit a website. They
                  allow the site to remember your actions and preferences (such as language, session,
                  settings) over a period of time.
                </p>

                <h2 className="text-xl font-bold text-black mt-8">2. Types of Cookies We Use</h2>

                <h3 className="text-lg font-bold text-gold mt-6">Essential Cookies</h3>
                <p>
                  Necessary for the site to function. They enable authentication, security, and
                  session management. Without these cookies, you couldn&apos;t log in or use protected
                  features. <strong>Cannot be disabled.</strong>
                </p>

                <h3 className="text-lg font-bold text-gold mt-6">Preference Cookies</h3>
                <p>
                  Store your language preferences (Spanish/English) and personal settings. Improve
                  your experience by remembering your choices.
                </p>

                <h3 className="text-lg font-bold text-gold mt-6">Analytics Cookies</h3>
                <p>
                  Help us understand how users interact with the site (most visited pages, time on
                  each section). All information is anonymous and aggregated. We don&apos;t sell this
                  information to third parties.
                </p>

                <h3 className="text-lg font-bold text-gold mt-6">Marketing Cookies</h3>
                <p>
                  Only if you&apos;ve given explicit consent. Used to show relevant content based on
                  your interests. You can disable them at any time.
                </p>

                <h2 className="text-xl font-bold text-black mt-8">3. Third-Party Cookies</h2>
                <p>Some services we use may set their own cookies:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Supabase</strong>: For authentication and session management</li>
                  <li><strong>Vercel Analytics</strong>: For performance metrics (anonymous)</li>
                  <li><strong>Anthropic</strong>: For AI functionality (no persistent cookies)</li>
                </ul>

                <h2 className="text-xl font-bold text-black mt-8">4. How to Control Cookies?</h2>
                <p>You have several options to control cookies:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Accept or reject the cookie banner when it appears</li>
                  <li>Configure your browser to block cookies (may affect functionality)</li>
                  <li>Delete existing cookies from your browser settings</li>
                  <li>Use private/incognito browsing mode</li>
                </ul>

                <h2 className="text-xl font-bold text-black mt-8">5. Your Rights</h2>
                <p>As a user, you have the right to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Know which cookies we use and what for</li>
                  <li>Revoke your consent at any time</li>
                  <li>Request deletion of your associated personal data</li>
                  <li>Access information about how we process your data</li>
                </ul>

                <h2 className="text-xl font-bold text-black mt-8">6. Changes to this Policy</h2>
                <p>
                  We may update this policy periodically. When we do, we&apos;ll update the &ldquo;Last
                  updated&rdquo; date at the top. We recommend reviewing it occasionally.
                </p>

                <h2 className="text-xl font-bold text-black mt-8">7. Contact</h2>
                <p>If you have questions about our use of cookies, contact us at:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Email: <a href="mailto:privacy@creditlegacy.ai" className="text-gold hover:underline">privacy@creditlegacy.ai</a></li>
                  <li>Support: <a href="mailto:hello@creditlegacy.ai" className="text-gold hover:underline">hello@creditlegacy.ai</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
