'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Link2, Stethoscope, Navigation, Send, Shield, Check, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const t = useTranslations('HowItWorks');
  const locale = useLocale();

  const steps = [
    {
      number: t('step1Number'),
      icon: Link2,
      title: t('step1Title'),
      desc: t('step1Desc'),
      details: [t('step1Detail1'), t('step1Detail2'), t('step1Detail3')],
    },
    {
      number: t('step2Number'),
      icon: Stethoscope,
      title: t('step2Title'),
      desc: t('step2Desc'),
      details: [t('step2Detail1'), t('step2Detail2'), t('step2Detail3')],
    },
    {
      number: t('step3Number'),
      icon: Navigation,
      title: t('step3Title'),
      desc: t('step3Desc'),
      details: [t('step3Detail1'), t('step3Detail2'), t('step3Detail3')],
    },
    {
      number: t('step4Number'),
      icon: Send,
      title: t('step4Title'),
      desc: t('step4Desc'),
      details: [t('step4Detail1'), t('step4Detail2'), t('step4Detail3')],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-offwhite">
        {/* Hero */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-offwhite to-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-graydark max-w-2xl mx-auto">{t('subtitle')}</p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                    !isEven ? 'md:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  {/* Number + Icon side */}
                  <div className={isEven ? 'md:text-right' : 'md:text-left'}>
                    <div className="inline-flex items-center gap-4 mb-4">
                      <span className="text-6xl md:text-8xl font-bold text-gradient-gold leading-none">
                        {step.number}
                      </span>
                      <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content side */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">{step.title}</h3>
                    <p className="text-graydark leading-relaxed mb-6">{step.desc}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <span className="text-graydark">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* After repair */}
        <section className="py-16 md:py-24 bg-black text-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-6">
              {t('afterTitle')}
            </h2>
            <p className="text-lg text-offwhite/90 leading-relaxed">{t('afterDesc')}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-offwhite">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">{t('ctaTitle')}</h2>
            <p className="text-graydark text-lg mb-8">{t('ctaText')}</p>
            <Link
              href={`/${locale}#waitlist`}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t('ctaButton')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
