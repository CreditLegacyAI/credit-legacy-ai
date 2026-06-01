'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-offwhite py-12 border-t-2 border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Brand */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center">
              <span className="text-gold font-bold text-sm">LN</span>
            </div>
            <div>
              <p className="font-bold">Credit Legacy AI</p>
              <p className="text-xs text-graydark uppercase tracking-wider">{t('division')}</p>
            </div>
          </div>

          {/* Tagline */}
          <p className="italic text-sm text-gold">&ldquo;{t('tagline')}&rdquo;</p>

          {/* Copyright */}
          <div className="text-xs text-graydark md:text-right">
            <p>© {year} {t('company')}</p>
            <p>{t('rights')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
