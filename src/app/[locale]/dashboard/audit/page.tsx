'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase-client';
import {
  Upload,
  FileText,
  X,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Lock,
  ArrowRight,
  Calendar,
  TrendingUp,
} from 'lucide-react';

type Stage = 'idle' | 'uploading' | 'parsing' | 'detecting' | 'analyzing' | 'saving' | 'completed' | 'error';

interface PreviousAudit {
  id: string;
  created_at: string;
  status: string;
  total_disputable_items: number | null;
  score_equifax: number | null;
  score_experian: number | null;
  score_transunion: number | null;
}

interface RateLimitInfo {
  daysRemaining: number;
  message: string;
}

export default function AuditPage() {
  const t = useTranslations('Audit');
  const locale = useLocale();
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [stage, setStage] = useState<Stage>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [previousAudits, setPreviousAudits] = useState<PreviousAudit[]>([]);
  const [completedAuditId, setCompletedAuditId] = useState<string | null>(null);

  // Load previous audits
  useEffect(() => {
    const loadAudits = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('audits')
        .select('id, created_at, status, total_disputable_items, score_equifax, score_experian, score_transunion')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) setPreviousAudits(data);
    };
    loadAudits();
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const totalFiles = files.length + acceptedFiles.length;
      if (totalFiles > 3) {
        setErrorMsg(locale === 'es' ? 'Máximo 3 archivos' : 'Maximum 3 files');
        return;
      }
      setErrorMsg('');
      setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 3));
    },
    [files.length, locale]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024,
    maxFiles: 3 - files.length,
    disabled: stage !== 'idle' || files.length >= 3,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    if (files.length === 0) return;

    setStage('uploading');
    setErrorMsg('');

    // Step 1: Upload files
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    try {
      const uploadRes = await fetch('/api/audit/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (uploadRes.status === 429) {
        setRateLimit({
          daysRemaining: uploadData.daysRemaining,
          message: uploadData.message,
        });
        setStage('idle');
        return;
      }

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      const auditId = uploadData.auditId;

      // Step 2: Trigger analysis (long running)
      setStage('parsing');

      // Cycle through stages for UX
      const stageTimers = [
        setTimeout(() => setStage('detecting'), 3000),
        setTimeout(() => setStage('analyzing'), 8000),
        setTimeout(() => setStage('saving'), 25000),
      ];

      const analyzeRes = await fetch('/api/audit/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId }),
      });

      stageTimers.forEach(clearTimeout);

      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        throw new Error(analyzeData.error || 'Analysis failed');
      }

      setStage('completed');
      setCompletedAuditId(auditId);
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setStage('error');
    }
  };

  const reset = () => {
    setFiles([]);
    setStage('idle');
    setErrorMsg('');
    setCompletedAuditId(null);
    setRateLimit(null);
  };

  // Render different states
  const isProcessing = ['uploading', 'parsing', 'detecting', 'analyzing', 'saving'].includes(stage);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl gradient-gold flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">{t('pageTitle')}</h1>
            <p className="text-graydark text-sm">{t('pageSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Rate limit notice */}
      {rateLimit && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-black mb-1">{t('rateLimitTitle')}</h3>
            <p className="text-sm text-graydark mb-2">
              {t('rateLimitDesc')} <strong>{rateLimit.daysRemaining} {rateLimit.daysRemaining === 1 ? t('dayRemaining') : t('daysRemaining')}</strong>
            </p>
            {previousAudits.length > 0 && (
              <Link
                href={`/${locale}/dashboard/audit/${previousAudits[0].id}`}
                className="text-gold hover:underline text-sm font-medium inline-flex items-center gap-1"
              >
                {t('viewReport')} <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Completed state */}
      {stage === 'completed' && completedAuditId && (
        <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center mb-6">
          <div className="w-20 h-20 rounded-2xl gradient-gold mx-auto flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">{t('completed')}</h2>
          <Link
            href={`/${locale}/dashboard/audit/${completedAuditId}`}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg mt-4"
          >
            {t('viewReport')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Error state */}
      {stage === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center mb-6">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">{t('errorTitle')}</h2>
          <p className="text-graydark text-sm mb-4">{errorMsg}</p>
          <button
            onClick={reset}
            className="bg-gold hover:bg-gold-dark text-white px-6 py-2 rounded-full font-medium transition-all"
          >
            {t('errorRetry')}
          </button>
        </div>
      )}

      {/* Upload state */}
      {stage === 'idle' && !rateLimit && (
        <>
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gold/20 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-black mb-1">{t('uploadTitle')}</h2>
            <p className="text-graydark text-sm mb-6">{t('uploadSubtitle')}</p>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-gold bg-gold/5'
                  : files.length >= 3
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    : 'border-gold/30 hover:border-gold hover:bg-gold/5'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gold mx-auto mb-3" />
              <p className="font-medium text-black mb-1">{t('dropzoneText')}</p>
              <p className="text-xs text-graydark">{t('dropzoneSubtext')}</p>
            </div>

            {/* Selected files */}
            {files.length > 0 && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-graydark font-medium mb-3">
                  {files.length} {files.length === 1 ? t('fileSelected') : t('filesSelected')}
                </p>
                <div className="space-y-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-offwhite rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-gold flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-black truncate">{file.name}</p>
                          <p className="text-xs text-graydark">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(i)}
                        className="text-graydark hover:text-red-600 transition-colors flex-shrink-0 ml-3"
                        aria-label={t('removeFile')}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="text-red-600 text-sm mt-4 text-center">{errorMsg}</p>
            )}

            {/* Action button */}
            {files.length > 0 && (
              <button
                onClick={startAnalysis}
                className="w-full mt-6 bg-gold hover:bg-gold-dark text-white py-3.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {t('startAnalysis')}
              </button>
            )}
          </div>

          {/* Tips card */}
          <div className="bg-offwhite rounded-3xl p-6 md:p-8 border border-gold/20 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-5 h-5 text-gold" />
              <h3 className="font-bold text-black">{t('tipsTitle')}</h3>
            </div>
            <ul className="space-y-2 text-sm text-graydark">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{t('tip1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{t('tip2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{t('tip3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{t('tip4')}</span>
              </li>
            </ul>
          </div>

          {/* Where to get reports */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gold/20 mb-6">
            <h3 className="font-bold text-black mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gold" />
              {t('whereToGet')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.annualcreditreport.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-graydark hover:text-gold transition-colors inline-flex items-center gap-1"
                >
                  {t('annualLink')} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.myfico.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-graydark hover:text-gold transition-colors inline-flex items-center gap-1"
                >
                  {t('myFicoLink')} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.creditkarma.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-graydark hover:text-gold transition-colors inline-flex items-center gap-1"
                >
                  {t('creditKarmaLink')} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Monitoring teaser */}
          <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-3xl p-6 md:p-8 border border-gold/20 mb-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-bold text-black">{t('monitoringTitle')}</h3>
              <span className="text-xs bg-gold text-white px-3 py-1 rounded-full font-medium uppercase tracking-wider whitespace-nowrap">
                {t('monitoringComingSoon')}
              </span>
            </div>
            <p className="text-sm text-graydark">{t('monitoringDesc')}</p>
          </div>
        </>
      )}

      {/* Processing state */}
      {isProcessing && (
        <div className="bg-white rounded-3xl p-10 text-center border border-gold/20 shadow-lg mb-6">
          <Loader2 className="w-16 h-16 text-gold mx-auto mb-6 animate-spin" />
          <h2 className="text-xl font-bold text-black mb-2">
            {stage === 'uploading' && t('uploadingFiles')}
            {stage === 'parsing' && t('parsingPdf')}
            {stage === 'detecting' && t('detectingBureaus')}
            {stage === 'analyzing' && t('aiAnalyzing')}
            {stage === 'saving' && t('savingResults')}
          </h2>
          <div className="flex items-center justify-center gap-1 mt-6 max-w-xs mx-auto">
            {(['uploading', 'parsing', 'detecting', 'analyzing', 'saving'] as Stage[]).map((s, i) => {
              const stageOrder = ['uploading', 'parsing', 'detecting', 'analyzing', 'saving'];
              const currentIdx = stageOrder.indexOf(stage);
              const isActive = i <= currentIdx;
              return (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    isActive ? 'bg-gold' : 'bg-gold/20'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Previous audits */}
      {stage === 'idle' && previousAudits.length > 0 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gold/20">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold" />
            {t('previousAudits')}
          </h3>
          <div className="space-y-2">
            {previousAudits.map((audit) => (
              <Link
                key={audit.id}
                href={`/${locale}/dashboard/audit/${audit.id}`}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-offwhite transition-colors border border-transparent hover:border-gold/20"
              >
                <div>
                  <p className="text-sm font-medium text-black">
                    {new Date(audit.created_at).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${
                      audit.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : audit.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {audit.status}
                    </span>
                    {audit.total_disputable_items !== null && (
                      <span className="text-xs text-graydark inline-flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {audit.total_disputable_items} items
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
