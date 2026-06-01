import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export default async function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const isES = locale === 'es';

  return (
    <div className="min-h-screen bg-offwhite">
      <header className="bg-white border-b border-gold/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center">
              <span className="text-gold font-bold text-sm">LN</span>
            </div>
            <span className="font-bold">Credit Legacy AI</span>
          </div>
          <form action="/api/auth/signout" method="post">
            <button className="text-sm text-graydark hover:text-gold">
              {isES ? 'Cerrar Sesión' : 'Sign Out'}
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gold/20">
          <div className="text-center">
            <div className="text-6xl mb-6">👋</div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
              {isES ? `Hola, ${user.email}` : `Hello, ${user.email}`}
            </h1>
            <p className="text-graydark text-lg mb-8">
              {isES
                ? 'Tu dashboard está en construcción. Próximamente: Smart Audit, Strategy Generator y más.'
                : 'Your dashboard is under construction. Coming soon: Smart Audit, Strategy Generator and more.'}
            </p>
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-5 py-2 rounded-full text-sm">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              {isES ? 'En desarrollo activo' : 'Active development'}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
