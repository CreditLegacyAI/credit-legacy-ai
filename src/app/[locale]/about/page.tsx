'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Target, Sparkles, Heart, Globe2, Building2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('About');
  const locale = useLocale();

  const values = [
    { icon: Sparkles, title: t('value1Title'), desc: t('value1Desc') },
    { icon: Heart, title: t('value2Title'), desc: t('value2Desc') },
    { icon: Target, title: t('value3Title'), desc: t('value3Desc') },
    { icon: Globe2, title: t('value4Title'), desc: t('value4Desc') },
  ];

  const divisions = [
    { name: t('division1'), desc: t('division1Desc') },
    { name: t('division2'), desc: t('division2Desc') },
    { name: t('division3'), desc: t('division3Desc') },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-offwhite">
        {/* Hero */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-offwhite to-white overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gold blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Image
              src="/logo.png"
              alt="Credit Legacy AI"
              width={80}
              height={80}
              className="mx-auto mb-6"
            />
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-6">
              <Building2 className="w-4 h-4 text-gold" />
              <span className="text-gold text-xs font-medium uppercase tracking-wider">
                {t('subtitle')}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-graydark leading-relaxed max-w-3xl mx-auto">
              {t('intro')}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-6">
              {t('missionTitle')}
            </h2>
            <p className="text-lg text-graydark leading-relaxed">{t('missionText')}</p>
          </div>
        </section>

        {/* Founder */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
              {t('founderTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 text-center">
                <div className="w-48 h-48 mx-auto rounded-full border-4 border-gold gradient-gold flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-6xl">WN</span>
                </div>
                <h3 className="font-bold text-xl text-black mt-4">{t('founderName')}</h3>
                <p className="text-sm text-gold uppercase tracking-wider mt-1">{t('founderRole')}</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <p className="text-graydark leading-relaxed">{t('founderBio1')}</p>
                <p className="text-graydark leading-relaxed">{t('founderBio2')}</p>
                <blockquote className="border-l-4 border-gold pl-6 py-2 italic text-black text-lg mt-6">
                  &ldquo;{t('founderQuote')}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Company structure */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-6">
              {t('companyTitle')}
            </h2>
            <p className="text-center text-graydark text-lg max-w-3xl mx-auto mb-12">
              {t('companyText')}
            </p>

            <h3 className="text-xl font-bold text-gold uppercase tracking-wider text-center mb-8">
              {t('divisionsTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {divisions.map((d, i) => (
                <div
                  key={i}
                  className="bg-offwhite border border-gold/20 rounded-2xl p-6 hover:border-gold transition-all"
                >
                  <h4 className="font-bold text-black mb-2">{d.name}</h4>
                  <p className="text-sm text-graydark">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-black text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-gold text-center mb-12">
              {t('valuesTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/5 border border-gold/30 rounded-2xl p-6 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gold mb-2">{v.title}</h4>
                        <p className="text-sm text-offwhite/80">{v.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
