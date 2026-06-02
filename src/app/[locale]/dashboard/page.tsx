import { createClient } from '@/lib/supabase-server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { TrendingUp, Target, FileText, MessageCircle, ArrowRight } from 'lucide-react';

export default async function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const t = await getTranslations('Dashboard');

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'CEO';

  // Load latest completed audit
  let latestAudit = null;
  let openDisputes = 0;
  if (user) {
    const { data: auditData } = await supabase
      .from('audits')
      .select('id, score_equifax, score_experian, score_transunion, total_disputable_items, completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();
    latestAudit = auditData;

    const { count } = await supabase
      .from('disputable_items')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('dispute_status', 'pending');
    openDisputes = count || 0;
  }

  // Average score across bureaus
  const scores = latestAudit
    ? [latestAudit.score_equifax, latestAudit.score_experian, latestAudit.score_transunion].filter(
        (s): s is number => s !== null
      )
    : [];
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          {t('welcome')}, {userName}
        </h1>
        <p className="text-graydark">
          {locale === 'es'
            ? 'Aquí está el resumen de tu progreso de crédito.'
            : 'Here is your credit progress overview.'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-graydark uppercase tracking-wider">
              {t('creditScore')}
            </span>
            <TrendingUp className="w-4 h-4 text-gold" />
          </div>
          <div className="text-3xl font-bold text-gradient-gold">{avgScore || '---'}</div>
          <div className="text-xs text-graydark mt-1">
            {avgScore
              ? locale === 'es' ? 'Promedio 3 bureaus' : 'Average 3 bureaus'
              : `${t('scoreChange')}: --`}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-graydark uppercase tracking-wider">
              {t('openDisputes')}
            </span>
            <Target className="w-4 h-4 text-gold" />
          </div>
          <div className="text-3xl font-bold text-black">{openDisputes}</div>
          <div className="text-xs text-graydark mt-1">{locale === 'es' ? 'En progreso' : 'In progress'}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-graydark uppercase tracking-wider">
              {t('completedDisputes')}
            </span>
            <Target className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-black">0</div>
          <div className="text-xs text-graydark mt-1">{locale === 'es' ? 'Resueltas' : 'Resolved'}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-graydark uppercase tracking-wider">
              {t('lettersGenerated')}
            </span>
            <FileText className="w-4 h-4 text-gold" />
          </div>
          <div className="text-3xl font-bold text-black">0</div>
          <div className="text-xs text-graydark mt-1">{locale === 'es' ? 'Cartas' : 'Letters'}</div>
        </div>
      </div>

      {/* CTA cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href={`/${locale}/dashboard/audit`}
          className="group bg-gradient-to-br from-gold to-gold-dark text-white rounded-2xl p-8 transition-all hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80 mb-2">
                {t('nextStep')}
              </div>
              <h3 className="text-2xl font-bold">{t('startAudit')}</h3>
            </div>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-sm opacity-90">
            {locale === 'es'
              ? 'Comienza analizando tu reporte de crédito completo.'
              : 'Start by analyzing your complete credit report.'}
          </p>
        </Link>

        <Link
          href={`/${locale}/dashboard/coach`}
          className="group bg-white border border-gold/20 rounded-2xl p-8 transition-all hover:border-gold hover:shadow-xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-gold mb-2">AI Coach</div>
              <h3 className="text-2xl font-bold text-black">
                {locale === 'es' ? 'Habla con el Entrenador' : 'Talk to the Coach'}
              </h3>
            </div>
            <MessageCircle className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-sm text-graydark">
            {locale === 'es'
              ? 'Pregunta cualquier duda sobre tu crédito 24/7.'
              : 'Ask any credit question 24/7.'}
          </p>
        </Link>
      </div>

      {/* Empty state si no hay audits */}
      {!latestAudit && (
        <div className="bg-white rounded-2xl p-12 border border-gold/20 text-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gold" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t('noDataTitle')}</h3>
          <p className="text-graydark mb-6">{t('noDataDesc')}</p>
          <Link
            href={`/${locale}/dashboard/audit`}
            className="inline-block bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-full font-medium transition-all"
          >
            {t('startAudit')}
          </Link>
        </div>
      )}

      {/* Latest audit shortcut */}
      {latestAudit && (
        <div className="bg-white rounded-2xl p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-black">
              {locale === 'es' ? 'Tu Último Audit' : 'Your Latest Audit'}
            </h3>
            <Link
              href={`/${locale}/dashboard/audit/${latestAudit.id}`}
              className="text-sm text-gold hover:underline inline-flex items-center gap-1"
            >
              {locale === 'es' ? 'Ver detalles' : 'View details'} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-graydark uppercase tracking-wider">
                {locale === 'es' ? 'Fecha' : 'Date'}
              </p>
              <p className="font-medium text-black">
                {latestAudit.completed_at
                  ? new Date(latestAudit.completed_at).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-graydark uppercase tracking-wider">
                {locale === 'es' ? 'Items' : 'Items'}
              </p>
              <p className="font-medium text-black">{latestAudit.total_disputable_items || 0}</p>
            </div>
            {latestAudit.score_equifax && (
              <div>
                <p className="text-xs text-graydark uppercase tracking-wider">Equifax</p>
                <p className="font-medium text-black">{latestAudit.score_equifax}</p>
              </div>
            )}
            {latestAudit.score_experian && (
              <div>
                <p className="text-xs text-graydark uppercase tracking-wider">Experian</p>
                <p className="font-medium text-black">{latestAudit.score_experian}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
