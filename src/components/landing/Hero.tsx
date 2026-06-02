'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-offwhite to-white pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" />
            <span className="text-gold text-xs font-medium uppercase tracking-wider">
              {t('badge')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-6 animate-fade-in-up">
            {t('title1')}
            <br />
            <span className="text-gradient-gold">{t('title2')}</span>
          </h1>

          <p className="text-lg md:text-xl text-graydark max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('subtitle')}
          </p>

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

          <div className="inline-flex items-center gap-2 text-xs text-graydark mb-16">
            <ShieldCheck className="w-4 h-4 text-gold" />
            {t('trustBadge')}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto pt-8 border-t border-gold/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient-gold">
                {t('stats1Number')}
              </div>
              <div className="text-xs md:text-sm text-graydark mt-1 uppercase tracking-wider">
                {t('stats1Label')}
              </div>
            </div>
            <div className="text-center border-x border-gold/20">
              <div className="text-3xl md:text-4xl font-bold text-gradient-gold">
                {t('stats2Number')}
              </div>
              <div className="text-xs md:text-sm text-graydark mt-1 uppercase tracking-wider">
                {t('stats2Label')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient-gold">
                {t('stats3Number')}
              </div>
              <div className="text-xs md:text-sm text-graydark mt-1 uppercase tracking-wider">
                {t('stats3Label')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
