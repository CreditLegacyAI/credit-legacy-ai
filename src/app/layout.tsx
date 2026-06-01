import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Credit Legacy AI · Reparación de Crédito con IA',
  description:
    'La primera plataforma SaaS bilingüe de reparación de crédito diseñada para la comunidad hispana.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
