import type { MetadataRoute } from 'next';

const BASE_URL = 'https://creditlegacy.ai';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Public routes per locale
  const publicRoutes = ['', '/about', '/how-it-works', '/contact'];
  const legalRoutes = ['/legal/terms', '/legal/privacy', '/legal/fcra', '/legal/cookies'];

  const allRoutes = [...publicRoutes, ...legalRoutes];
  const locales = ['es', 'en'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of allRoutes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route.startsWith('/legal') ? 0.3 : 0.8,
        alternates: {
          languages: {
            es: `${BASE_URL}/es${route}`,
            en: `${BASE_URL}/en${route}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
