'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase-client';
import {
  Shield,
  Lock,
  CheckCircle2,
  User,
  MapPin,
  CreditCard,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5;

interface OnboardingData {
  legalName: string;
  dob: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  taxIdType: 'SSN' | 'ITIN';
  taxId: string;
}

export default function OnboardingPage() {
  const t = useTranslations('Onboarding');
  const locale = useLocale();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<OnboardingData>({
    legalName: '',
    dob: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    taxIdType: 'SSN',
    taxId: '',
  });

  const updateField = (field: keyof OnboardingData, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleNext = () => {
    if (step < 5) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || 'Error saving data');
        setLoading(false);
        return;
      }

      router.push(`/${locale}/dashboard`);
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };

  const skipOnboarding = () => {
    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-offwhite py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo + skip */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Credit Legacy AI"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold">Credit Legacy AI</span>
          </Link>
          <button
            onClick={skipOnboarding}
            className="text-sm text-graydark hover:text-gold transition-colors"
          >
            {t('skip')}
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-graydark uppercase tracking-wider mb-2">
            <span>
              {t('step')} {step} {t('of')} 5
            </span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gold/20 rounded-full overflow-hidden">
            <div
              className="h-full gradient-gold transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gold/20">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl gradient-gold flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-black mb-3">{t('welcomeTitle')}</h1>
              <p className="text-graydark mb-8">{t('welcomeText')}</p>
              <ul className="space-y-3 text-left max-w-md mx-auto mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-graydark">{t('welcomeBenefit1')}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Lock className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-graydark">{t('welcomeBenefit2')}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-graydark">{t('welcomeBenefit3')}</span>
                </li>
              </ul>
            </div>
          )}

          {/* Step 2: Personal info */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{t('personalTitle')}</h2>
                  <p className="text-sm text-graydark">{t('personalSubtitle')}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-graydark uppercase tracking-wider font-medium block mb-2">
                    {t('legalNameLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('legalNamePlaceholder')}
                    value={data.legalName}
                    onChange={(e) => updateField('legalName', e.target.value)}
                    className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-graydark uppercase tracking-wider font-medium block mb-2">
                    {t('dobLabel')}
                  </label>
                  <input
                    type="date"
                    value={data.dob}
                    onChange={(e) => updateField('dob', e.target.value)}
                    className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-graydark uppercase tracking-wider font-medium block mb-2">
                    {t('phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (787) 555-0123"
                    value={data.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{t('addressTitle')}</h2>
                  <p className="text-sm text-graydark">{t('addressSubtitle')}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-graydark uppercase tracking-wider font-medium block mb-2">
                    {t('streetLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('streetPlaceholder')}
                    value={data.street}
                    onChange={(e) => updateField('street', e.target.value)}
                    className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-graydark uppercase tracking-wider font-medium block mb-2">
                      {t('cityLabel')}
                    </label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-graydark uppercase tracking-wider font-medium block mb-2">
                      {t('stateLabel')}
                    </label>
                    <input
                      type="text"
                      placeholder="PR"
                      maxLength={2}
                      value={data.state}
                      onChange={(e) => updateField('state', e.target.value.toUpperCase())}
                      className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-graydark uppercase tracking-wider font-medium block mb-2">
                    {t('zipLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder="00612"
                    maxLength={10}
                    value={data.zip}
                    onChange={(e) => updateField('zip', e.target.value)}
                    className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Tax ID */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{t('taxIdTitle')}</h2>
                  <p className="text-sm text-graydark">{t('taxIdSubtitle')}</p>
                </div>
              </div>

              <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Lock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs text-graydark">{t('taxIdNotice')}</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-800">{t('cpnWarning')}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-graydark uppercase tracking-wider font-medium block mb-2">
                    {t('taxIdTypeLabel')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateField('taxIdType', 'SSN')}
                      className={`py-3 rounded-full border-2 font-medium transition-all ${
                        data.taxIdType === 'SSN'
                          ? 'bg-gold border-gold text-white'
                          : 'border-gold/20 text-graydark hover:border-gold/50'
                      }`}
                    >
                      SSN
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('taxIdType', 'ITIN')}
                      className={`py-3 rounded-full border-2 font-medium transition-all ${
                        data.taxIdType === 'ITIN'
                          ? 'bg-gold border-gold text-white'
                          : 'border-gold/20 text-graydark hover:border-gold/50'
                      }`}
                    >
                      ITIN
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-graydark uppercase tracking-wider font-medium block mb-2">
                    {t('taxIdLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('taxIdPlaceholder')}
                    value={data.taxId}
                    onChange={(e) => updateField('taxId', e.target.value)}
                    maxLength={11}
                    className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl gradient-gold flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">{t('completeTitle')}</h2>
                <p className="text-graydark">{t('completeText')}</p>
              </div>

              <div className="bg-offwhite rounded-2xl p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-graydark">{t('legalNameLabel')}:</span>
                  <span className="text-black font-medium">{data.legalName || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-graydark">{t('dobLabel')}:</span>
                  <span className="text-black font-medium">{data.dob || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-graydark">{t('phoneLabel')}:</span>
                  <span className="text-black font-medium">{data.phone || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-graydark">{t('streetLabel')}:</span>
                  <span className="text-black font-medium text-right">
                    {data.street}
                    {data.city && <>, {data.city}</>}
                    {data.state && <> {data.state}</>}
                    {data.zip && <> {data.zip}</>}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-graydark">{data.taxIdType}:</span>
                  <span className="text-black font-medium font-mono">
                    ***-**-{data.taxId.slice(-4) || '****'}
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center mt-4">{error}</p>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gold/20">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-2 text-graydark hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back')}
            </button>

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
              >
                {t('next')}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-50 text-white px-6 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
              >
                {loading ? '...' : t('finish')}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
