'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
  };

  const navLinks = [
    { href: `/${locale}/how-it-works`, label: t('howItWorks') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}#pricing`, label: t('pricing') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-offwhite/95 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Credit Legacy AI"
              width={40}
              height={40}
              priority
              className="w-10 h-10 object-contain"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold text-black text-sm">Credit Legacy AI</span>
              <span className="text-gold text-[10px] uppercase tracking-wider">
                Nieves Legacy Partners
              </span>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-graydark hover:text-gold transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}

            {/* Language switcher */}
            <div className="flex items-center gap-1 text-sm border border-gold/30 rounded-full px-1 py-1">
              <button
                onClick={() => switchLocale('es')}
                className={`px-3 py-1 rounded-full transition-all ${
                  locale === 'es' ? 'bg-gold text-white' : 'text-graydark hover:text-gold'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => switchLocale('en')}
                className={`px-3 py-1 rounded-full transition-all ${
                  locale === 'en' ? 'bg-gold text-white' : 'text-graydark hover:text-gold'
                }`}
              >
                EN
              </button>
            </div>

            <Link
              href={`/${locale}/auth/login`}
              className="text-graydark hover:text-gold transition-colors text-sm"
            >
              {t('login')}
            </Link>
            <Link
              href={`/${locale}/auth/signup`}
              className="bg-gold hover:bg-gold-dark text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              {t('signup')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-graydark"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gold/20 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-graydark hover:text-gold transition-colors text-sm py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-3 border-t border-gold/10">
              <button
                onClick={() => switchLocale(locale === 'es' ? 'en' : 'es')}
                className="text-xs border border-gold/30 rounded-full px-3 py-1 text-graydark"
              >
                {locale === 'es' ? 'EN' : 'ES'}
              </button>
              <Link
                href={`/${locale}/auth/login`}
                className="text-graydark text-sm flex-1 text-center"
              >
                {t('login')}
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                className="bg-gold text-white px-4 py-2 rounded-full text-xs font-medium"
              >
                {t('signup')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
