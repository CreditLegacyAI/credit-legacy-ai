'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  LayoutDashboard,
  Stethoscope,
  Navigation,
  FileText,
  MessageCircle,
  Settings,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const pathname = usePathname();

  const items = [
    { href: `/${locale}/dashboard`, label: t('overview'), icon: LayoutDashboard },
    { href: `/${locale}/dashboard/audit`, label: t('smartAudit'), icon: Stethoscope },
    { href: `/${locale}/dashboard/strategy`, label: t('strategy'), icon: Navigation },
    { href: `/${locale}/dashboard/letters`, label: t('letters'), icon: FileText },
    { href: `/${locale}/dashboard/coach`, label: t('coach'), icon: MessageCircle },
    { href: `/${locale}/dashboard/settings`, label: t('settings'), icon: Settings },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gold/20 min-h-screen">
      <Link
        href={`/${locale}/dashboard`}
        className="flex items-center gap-3 p-6 border-b border-gold/20"
      >
        <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center">
          <span className="text-gold font-bold text-sm">LN</span>
        </div>
        <div>
          <p className="font-bold text-sm">Credit Legacy AI</p>
          <p className="text-[10px] text-graydark uppercase tracking-wider">Dashboard</p>
        </div>
      </Link>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                active
                  ? 'bg-gold text-white shadow-md'
                  : 'text-graydark hover:bg-offwhite hover:text-gold'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <form action="/api/auth/signout" method="post" className="p-4 border-t border-gold/20">
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-graydark hover:bg-offwhite hover:text-red-600 transition-all text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('signOut')}</span>
        </button>
      </form>
    </aside>
  );
}
