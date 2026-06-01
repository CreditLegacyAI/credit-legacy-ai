'use client';

import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-offwhite to-white pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-medium uppercase tracking-wider">
              {t('badge')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-6">
            {t('title1')}
            <br />
            <span className="text-gradient-gold">{t('title2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-graydark max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#waitlist"
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t('ctaPrimary')}
            </a>
            <a
              href="#features"
              className="w-full sm:w-auto border-2 border-gold text-gold hover:bg-gold hover:text-white px-8 py-4 rounded-full font-medium transition-all"
            >
              {t('ctaSecondary')}
            </a>
          </div>

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 text-xs text-graydark">
            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {t('trustBadge')}
          </div>
        </div>
      </div>
    </section>
  );
}
