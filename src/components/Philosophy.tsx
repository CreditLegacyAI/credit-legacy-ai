'use client';

import { useTranslations } from 'next-intl';

export default function Philosophy() {
  const t = useTranslations('Philosophy');

  return (
    <section id="philosophy" className="py-20 md:py-28 bg-black text-white relative overflow-hidden">
      {/* Gold accent */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-gold" />
      <div className="absolute bottom-0 left-0 right-0 h-1 gradient-gold" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-gradient-gold">
          {t('title')}
        </h2>

        {/* Quote */}
        <blockquote className="mb-16">
          <p className="text-xl md:text-3xl font-light italic leading-relaxed mb-6 text-offwhite">
            &ldquo;{t('quote')}&rdquo;
          </p>
          <footer>
            <p className="text-gold font-bold text-lg">{t('author')}</p>
            <p className="text-graydark text-sm uppercase tracking-wider">{t('role')}</p>
          </footer>
        </blockquote>

        {/* Anti-extractive philosophy */}
        <div className="border-t border-gold/30 pt-12">
          <h3 className="text-xl md:text-2xl font-bold text-gold mb-4 uppercase tracking-wider">
            {t('antiExtractive')}
          </h3>
          <p className="text-base md:text-lg text-offwhite leading-relaxed max-w-2xl mx-auto">
            {t('antiExtractiveDesc')}
          </p>
        </div>
      </div>
    </section>
  );
}
