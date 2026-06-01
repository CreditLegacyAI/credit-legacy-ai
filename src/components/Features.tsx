'use client';

import { useTranslations } from 'next-intl';

export default function Features() {
  const t = useTranslations('Features');

  const features = [
    {
      icon: '🩺',
      title: t('f1Title'),
      desc: t('f1Desc'),
    },
    {
      icon: '🧭',
      title: t('f2Title'),
      desc: t('f2Desc'),
    },
    {
      icon: '🏋️',
      title: t('f3Title'),
      desc: t('f3Desc'),
    },
    {
      icon: '🛡️',
      title: t('f4Title'),
      desc: t('f4Desc'),
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">{t('title')}</h2>
          <p className="text-lg text-graydark max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-offwhite border border-gold/20 hover:border-gold rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-black mb-3 group-hover:text-gold transition-colors">
                {f.title}
              </h3>
              <p className="text-graydark leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
