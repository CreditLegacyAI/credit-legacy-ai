import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase-server';
import AuditReportView from '@/components/audit/AuditReportView';

interface PageProps {
  params: { locale: string; id: string };
}

export default async function AuditDetailPage({ params }: PageProps) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${params.locale}/auth/login`);
  }

  // Fetch audit
  const { data: audit, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !audit) {
    notFound();
  }

  // Fetch disputable items
  const { data: items } = await supabase
    .from('disputable_items')
    .select('*')
    .eq('audit_id', params.id)
    .order('priority', { ascending: true })
    .order('estimated_score_impact', { ascending: false });

  return <AuditReportView audit={audit} items={items || []} locale={params.locale} />;
}
