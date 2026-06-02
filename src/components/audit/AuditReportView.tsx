'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Scale,
  Sparkles,
  Building2,
} from 'lucide-react';

interface Audit {
  id: string;
  created_at: string;
  status: string;
  report_type: string | null;
  bureaus_included: string[] | null;
  score_equifax: number | null;
  score_experian: number | null;
  score_transunion: number | null;
  total_disputable_items: number | null;
  executive_summary_es: string | null;
  executive_summary_en: string | null;
  estimated_cost_usd: number | null;
}

interface DisputableItem {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  estimated_score_impact: number | null;
  affected_bureaus: string[];
  creditor_name: string | null;
  account_number_masked: string | null;
  account_type: string | null;
  description_es: string;
  description_en: string;
  legal_basis: string | null;
  recommended_round: number;
}

interface Props {
  audit: Audit;
  items: DisputableItem[];
  locale: string;
}

export default function AuditReportView({ audit, items, locale }: Props) {
  const t = useTranslations('Audit');
  const isEs = locale === 'es';

  const executiveSummary = isEs ? audit.executive_summary_es : audit.executive_summary_en;
  const totalImpact = items.reduce((sum, i) => sum + (i.estimated_score_impact || 0), 0);

  // Group items by priority
  const high = items.filter((i) => i.priority === 'high');
  const medium = items.filter((i) => i.priority === 'medium');
  const low = items.filter((i) => i.priority === 'low');

  const categoryLabels: Record<string, string> = {
    personal_info: t('categoryPersonalInfo'),
    incorrect_balance: t('categoryIncorrectBalance'),
    incorrect_status: t('categoryIncorrectStatus'),
    incorrect_dates: t('categoryIncorrectDates'),
    duplicate_account: t('categoryDuplicate'),
    not_mine: t('categoryNotMine'),
    outdated: t('categoryOutdated'),
    collection: t('categoryCollection'),
    charge_off: t('categoryChargeOff'),
    late_payment: t('categoryLatePayment'),
    hard_inquiry: t('categoryHardInquiry'),
    public_record: t('categoryPublicRecord'),
    mixed_file: t('categoryMixedFile'),
    other: t('categoryOther'),
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      {/* Back */}
      <Link
        href={`/${locale}/dashboard/audit`}
        className="inline-flex items-center gap-2 text-graydark hover:text-gold transition-colors text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Smart Audit
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl gradient-gold flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">{t('reportTitle')}</h1>
            <p className="text-graydark text-sm">
              {new Date(audit.created_at).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Scores */}
      {(audit.score_equifax || audit.score_experian || audit.score_transunion) && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gold/20 shadow-sm mb-6">
          <h2 className="font-bold text-black mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" />
            {t('scoresTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {audit.score_equifax && (
              <ScoreCard label="Equifax" score={audit.score_equifax} />
            )}
            {audit.score_experian && (
              <ScoreCard label="Experian" score={audit.score_experian} />
            )}
            {audit.score_transunion && (
              <ScoreCard label="TransUnion" score={audit.score_transunion} />
            )}
          </div>
        </div>
      )}

      {/* Executive Summary */}
      {executiveSummary && (
        <div className="bg-gradient-to-br from-gold/5 to-white rounded-3xl p-6 md:p-8 border border-gold/20 mb-6">
          <h2 className="font-bold text-black mb-4 flex items-center gap-2">
            <Scale className="w-4 h-4 text-gold" />
            {t('executiveSummary')}
          </h2>
          <div className="text-graydark leading-relaxed whitespace-pre-wrap">{executiveSummary}</div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={AlertTriangle}
          label={t('totalItemsFound')}
          value={items.length.toString()}
        />
        <StatCard
          icon={TrendingUp}
          label={t('estimatedImpact')}
          value={`+${totalImpact} pts`}
        />
        <StatCard
          icon={Building2}
          label={t('bureaus')}
          value={(audit.bureaus_included || []).map((b) => b.toUpperCase()).join(', ') || '—'}
        />
      </div>

      {/* Disputable Items */}
      {items.length === 0 ? (
        <div className="bg-green-50 rounded-3xl p-10 text-center border border-green-200">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">{t('noItemsTitle')}</h2>
          <p className="text-graydark">{t('noItemsDesc')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="font-bold text-black text-xl flex items-center gap-2">
            {t('disputableItemsTitle')}
          </h2>

          {/* High priority */}
          {high.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <h3 className="text-sm uppercase tracking-wider font-bold text-red-600">
                  {t('priorityHigh')} ({high.length})
                </h3>
              </div>
              <div className="space-y-3">
                {high.map((item) => (
                  <ItemCard key={item.id} item={item} isEs={isEs} categoryLabels={categoryLabels} t={t} />
                ))}
              </div>
            </div>
          )}

          {/* Medium priority */}
          {medium.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <h3 className="text-sm uppercase tracking-wider font-bold text-yellow-700">
                  {t('priorityMedium')} ({medium.length})
                </h3>
              </div>
              <div className="space-y-3">
                {medium.map((item) => (
                  <ItemCard key={item.id} item={item} isEs={isEs} categoryLabels={categoryLabels} t={t} />
                ))}
              </div>
            </div>
          )}

          {/* Low priority */}
          {low.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-sm uppercase tracking-wider font-bold text-blue-600">
                  {t('priorityLow')} ({low.length})
                </h3>
              </div>
              <div className="space-y-3">
                {low.map((item) => (
                  <ItemCard key={item.id} item={item} isEs={isEs} categoryLabels={categoryLabels} t={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  // Score color based on FICO ranges
  const color =
    score >= 800
      ? 'text-green-600'
      : score >= 740
        ? 'text-green-500'
        : score >= 670
          ? 'text-yellow-600'
          : score >= 580
            ? 'text-orange-600'
            : 'text-red-600';

  return (
    <div className="bg-offwhite rounded-2xl p-5 text-center">
      <p className="text-xs uppercase tracking-wider text-graydark font-medium mb-2">{label}</p>
      <p className={`text-4xl font-bold ${color}`}>{score}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof TrendingUp; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gold/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gold" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-graydark font-medium">{label}</p>
          <p className="text-lg font-bold text-black">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  isEs,
  categoryLabels,
  t,
}: {
  item: DisputableItem;
  isEs: boolean;
  categoryLabels: Record<string, string>;
  t: ReturnType<typeof useTranslations<'Audit'>>;
}) {
  const description = isEs ? item.description_es : item.description_en;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gold/20 hover:border-gold/40 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-full uppercase tracking-wider font-medium">
            {categoryLabels[item.category] || item.category}
          </span>
          {item.creditor_name && (
            <h4 className="font-bold text-black mt-2">{item.creditor_name}</h4>
          )}
          {item.account_number_masked && (
            <p className="text-xs text-graydark mt-0.5 font-mono">{item.account_number_masked}</p>
          )}
        </div>
        {item.estimated_score_impact && (
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-gold">+{item.estimated_score_impact}</p>
            <p className="text-[10px] uppercase tracking-wider text-graydark">{t('points')}</p>
          </div>
        )}
      </div>

      <p className="text-sm text-graydark leading-relaxed mb-4">{description}</p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-graydark pt-3 border-t border-gold/10">
        {item.legal_basis && (
          <div className="flex items-center gap-1">
            <Scale className="w-3 h-3" />
            <span>{item.legal_basis}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{t('round')} {item.recommended_round}</span>
        </div>
        {item.affected_bureaus.length > 0 && (
          <div className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>{item.affected_bureaus.map((b) => b.toUpperCase()).join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
