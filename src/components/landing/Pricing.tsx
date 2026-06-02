'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function Pricing() {
  const t = useTranslations('Pricing');
  const locale = useLocale();

  const tiers = [
    {
      key: 'monitoring',
      name: t('monitoring.name'),
      price: t('monitoring.price'),
      desc: t('monitoring.desc'),
      features: [
        t('monitoring.feature1'),
        t('monitoring.feature2'),
        t('monitoring.feature3'),
        t('monitoring.feature4'),
      ],
      popular: false,
      highlight: false,
    },
    {
      key: 'basic',
      name: t('basic.name'),
      price: t('basic.price'),
      desc: t('basic.desc'),
      features: [
        t('basic.feature1'),
        t('basic.feature2'),
        t('basic.feature3'),
        t('basic.feature4'),
      ],
      popular: false,
      highlight: false,
    },
    {
      key: 'pro',
      name: t('pro.name'),
      price: t('pro.price'),
      desc: t('pro.desc'),
      features: [t('pro.feature1'), t('pro.feature2'), t('pro.feature3'), t('pro.feature4')],
      popular: true,
      highlight: true,
    },
    {
      key: 'proPlus',
      name: t('proPlus.name'),
      price: t('proPlus.price'),
      desc: t('proPlus.desc'),
      features: [
        t('proPlus.feature1'),
        t('proPlus.feature2'),
        t('proPlus.feature3'),
        t('proPlus.feature4'),
      ],
      popular: false,
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">{t('title')}</h2>
          <p className="text-lg text-graydark max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className={`relative bg-white rounded-2xl p-6 md:p-8 transition-all hover:shadow-xl ${
                tier.highlight
                  ? 'border-2 border-gold shadow-lg scale-105 md:scale-100 lg:scale-105'
                  : 'border border-gold/20'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-xs uppercase tracking-wider font-medium px-4 py-1 rounded-full">
                  {t('popular')}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-black mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-3">
                  <span className="text-4xl font-bold text-gradient-gold">{tier.price}</span>
                  <span className="text-graydark text-sm">{t('perMonth')}</span>
                </div>
                <p className="text-sm text-graydark min-h-[3rem]">{tier.desc}</p>
              </div>

              <ul className="space-y-3 mb-8 min-h-[12rem]">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-graydark">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/auth/signup?tier=${tier.key}`}
                className={`block w-full text-center py-3 rounded-full font-medium transition-all ${
                  tier.highlight
                    ? 'bg-gold hover:bg-gold-dark text-white shadow-md'
                    : 'border-2 border-gold text-gold hover:bg-gold hover:text-white'
                }`}
              >
                {t('cta')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
