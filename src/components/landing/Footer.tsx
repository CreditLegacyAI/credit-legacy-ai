'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-offwhite py-16 border-t-2 border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center">
                <span className="text-gold font-bold text-sm">LN</span>
              </div>
              <div>
                <p className="font-bold">Credit Legacy AI</p>
                <p className="text-xs text-graydark uppercase tracking-wider">
                  {t('division')}
                </p>
              </div>
            </div>
            <p className="italic text-sm text-gold">&ldquo;{t('tagline')}&rdquo;</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-gold mb-4 uppercase text-xs tracking-wider">
              {t('product')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-gold transition-colors">
                  {t('features')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-gold transition-colors">
                  {t('pricing')}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-gold transition-colors">
                  {t('faq')}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-gold mb-4 uppercase text-xs tracking-wider">
              {t('company2')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#philosophy" className="hover:text-gold transition-colors">
                  {t('philosophy')}
                </a>
              </li>
              <li>
                <a href="mailto:hello@creditlegacy.ai" className="hover:text-gold transition-colors">
                  {t('contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-gold mb-4 uppercase text-xs tracking-wider">
              {t('legal')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/legal/terms`} className="hover:text-gold transition-colors">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/legal/privacy`}
                  className="hover:text-gold transition-colors"
                >
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/fcra`} className="hover:text-gold transition-colors">
                  {t('fcra')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gold/20 text-xs text-graydark text-center md:flex md:justify-between md:items-center">
          <p>© {year} {t('company')}. {t('rights')}</p>
          <p className="mt-2 md:mt-0">creditlegacy.ai · hello@creditlegacy.ai</p>
        </div>
      </div>
    </footer>
  );
}
