import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://creditlegacy.ai'),
  title: {
    default: 'Credit Legacy AI · Reparación de Crédito con IA',
    template: '%s | Credit Legacy AI',
  },
  description:
    'La primera plataforma SaaS bilingüe de reparación de crédito diseñada para la comunidad hispana. FCRA compliant, ITIN friendly, 100% transparente.',
  keywords: [
    'reparación de crédito',
    'credit repair',
    'bilingual credit repair',
    'FCRA',
    'ITIN credit',
    'crédito hispano',
    'AI credit repair',
  ],
  authors: [{ name: 'William Nieves', url: 'https://creditlegacy.ai' }],
  creator: 'Nieves Legacy Partners LLC',
  publisher: 'Nieves Legacy Partners LLC',
  openGraph: {
    title: 'Credit Legacy AI · Reparación de Crédito con IA',
    description: 'La primera plataforma SaaS bilingüe de reparación de crédito.',
    url: 'https://creditlegacy.ai',
    siteName: 'Credit Legacy AI',
    locale: 'es_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credit Legacy AI',
    description: 'Reparación de crédito con Inteligencia Artificial.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
