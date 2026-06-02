'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Music2, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const year = new Date().getFullYear();

  const socials = [
    { icon: Instagram, href: 'https://instagram.com/creditlegacyai', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/@creditlegacyai', label: 'YouTube' },
    { icon: Music2, href: 'https://tiktok.com/@creditlegacyai', label: 'TikTok' },
    { icon: Facebook, href: 'https://facebook.com/creditlegacyai', label: 'Facebook' },
    { icon: Linkedin, href: 'https://linkedin.com/in/william-nieves-2940b63b5', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-black text-offwhite py-16 border-t-2 border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo-dark-bg.png"
                alt="Credit Legacy AI"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <div>
                <p className="font-bold text-lg">Credit Legacy AI</p>
                <p className="text-xs text-gold uppercase tracking-wider">
                  {t('division')}
                </p>
              </div>
            </div>
            <p className="italic text-sm text-gold mb-4">&ldquo;{t('tagline')}&rdquo;</p>
            <div className="flex items-center gap-3 mt-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full border border-gold/30 hover:border-gold hover:bg-gold/10 flex items-center justify-center transition-all"
                  >
                    <Icon className="w-4 h-4 text-gold" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-gold mb-4 uppercase text-xs tracking-wider">
              {t('product')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/how-it-works`} className="hover:text-gold transition-colors">
                  {t('howItWorks')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#features`} className="hover:text-gold transition-colors">
                  {t('features')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#pricing`} className="hover:text-gold transition-colors">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#faq`} className="hover:text-gold transition-colors">
                  {t('faq')}
                </Link>
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
                <Link href={`/${locale}/about`} className="hover:text-gold transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-gold transition-colors">
                  {t('contact')}
                </Link>
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
                <Link href={`/${locale}/legal/privacy`} className="hover:text-gold transition-colors">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/fcra`} className="hover:text-gold transition-colors">
                  {t('fcra')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/cookies`} className="hover:text-gold transition-colors">
                  {t('cookies')}
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
