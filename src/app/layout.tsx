import type { Metadata, Viewport } from 'next';
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
    'reparación crédito Puerto Rico',
    'Nieves Legacy Partners',
  ],
  authors: [{ name: 'William Nieves', url: 'https://creditlegacy.ai' }],
  creator: 'Nieves Legacy Partners LLC',
  publisher: 'Nieves Legacy Partners LLC',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Credit Legacy AI · Reparación de Crédito con IA',
    description:
      'La primera plataforma SaaS bilingüe de reparación de crédito para la comunidad hispana. FCRA compliant · ITIN friendly · 100% transparente.',
    url: 'https://creditlegacy.ai',
    siteName: 'Credit Legacy AI',
    locale: 'es_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Credit Legacy AI · Reparación de Crédito con Inteligencia Artificial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credit Legacy AI',
    description: 'Reparación de crédito con Inteligencia Artificial.',
    images: ['/og-image.png'],
    creator: '@creditlegacyai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://creditlegacy.ai',
    languages: {
      'es-US': 'https://creditlegacy.ai/es',
      'en-US': 'https://creditlegacy.ai/en',
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#AD7B49',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
