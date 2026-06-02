'use client';

import { useTranslations } from 'next-intl';
import { Stethoscope, Navigation, Dumbbell, Shield, Check } from 'lucide-react';

export default function Features() {
  const t = useTranslations('Features');

  const features = [
    {
      icon: Stethoscope,
      title: t('f1Title'),
      subtitle: t('f1Subtitle'),
      desc: t('f1Desc'),
      bullets: [t('f1Feature1'), t('f1Feature2'), t('f1Feature3')],
    },
    {
      icon: Navigation,
      title: t('f2Title'),
      subtitle: t('f2Subtitle'),
      desc: t('f2Desc'),
      bullets: [t('f2Feature1'), t('f2Feature2'), t('f2Feature3')],
    },
    {
      icon: Dumbbell,
      title: t('f3Title'),
      subtitle: t('f3Subtitle'),
      desc: t('f3Desc'),
      bullets: [t('f3Feature1'), t('f3Feature2'), t('f3Feature3')],
    },
    {
      icon: Shield,
      title: t('f4Title'),
      subtitle: t('f4Subtitle'),
      desc: t('f4Desc'),
      bullets: [t('f4Feature1'), t('f4Feature2'), t('f4Feature3')],
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
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group bg-offwhite border border-gold/20 hover:border-gold rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gold uppercase tracking-wider font-medium">
                      {f.subtitle}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-black group-hover:text-gold transition-colors">
                      {f.title}
                    </h3>
                  </div>
                </div>
                <p className="text-graydark leading-relaxed mb-5">{f.desc}</p>
                <ul className="space-y-2">
                  {f.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-graydark">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
