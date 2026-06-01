'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function Navbar() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-offwhite/95 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-gold flex items-center justify-center bg-white">
              <span className="text-gold font-bold text-sm">LN</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-black text-sm">Credit Legacy AI</span>
              <span className="text-gold text-[10px] uppercase tracking-wider">Nieves Legacy Partners</span>
            </div>
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-graydark hover:text-gold transition-colors text-sm">
              {t('features')}
            </a>
            <a href="#philosophy" className="text-graydark hover:text-gold transition-colors text-sm">
              {t('about')}
            </a>

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
              href="#waitlist"
              className="bg-gold hover:bg-gold-dark text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              {t('signup')}
            </Link>
          </div>

          {/* Mobile: solo language switcher + CTA */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => switchLocale(locale === 'es' ? 'en' : 'es')}
              className="text-xs border border-gold/30 rounded-full px-3 py-1 text-graydark"
            >
              {locale === 'es' ? 'EN' : 'ES'}
            </button>
            <Link
              href="#waitlist"
              className="bg-gold text-white px-4 py-2 rounded-full text-xs font-medium"
            >
              {t('signup')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
