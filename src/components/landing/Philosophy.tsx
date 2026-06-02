'use client';

import { useTranslations } from 'next-intl';
import { Eye, Unlock, GraduationCap } from 'lucide-react';

export default function Philosophy() {
  const t = useTranslations('Philosophy');

  const principles = [
    {
      icon: Eye,
      title: t('principle1Title'),
      desc: t('principle1Desc'),
    },
    {
      icon: Unlock,
      title: t('principle2Title'),
      desc: t('principle2Desc'),
    },
    {
      icon: GraduationCap,
      title: t('principle3Title'),
      desc: t('principle3Desc'),
    },
  ];

  return (
    <section id="philosophy" className="py-20 md:py-28 bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 gradient-gold" />
      <div className="absolute bottom-0 left-0 right-0 h-1 gradient-gold" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-gradient-gold">{t('title')}</h2>

        <blockquote className="mb-16">
          <p className="text-xl md:text-3xl font-light italic leading-relaxed mb-6 text-offwhite">
            &ldquo;{t('quote')}&rdquo;
          </p>
          <footer>
            <p className="text-gold font-bold text-lg">{t('author')}</p>
            <p className="text-graydark text-sm uppercase tracking-wider">{t('role')}</p>
          </footer>
        </blockquote>

        <div className="border-t border-gold/30 pt-12 mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-gold mb-4 uppercase tracking-wider">
            {t('antiExtractive')}
          </h3>
          <p className="text-base md:text-lg text-offwhite leading-relaxed max-w-2xl mx-auto">
            {t('antiExtractiveDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-gold" />
                </div>
                <h4 className="text-lg font-bold text-gold mb-2">{p.title}</h4>
                <p className="text-sm text-offwhite/80">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
