/**
 * Utility helpers para Credit Legacy AI.
 */

/**
 * Combina clases de Tailwind condicionales.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formatea un score de crédito con su categoría.
 */
export function getScoreCategory(score: number): {
  category: string;
  color: string;
  bgColor: string;
} {
  if (score >= 800) return { category: 'Excelente', color: 'text-green-700', bgColor: 'bg-green-100' };
  if (score >= 740) return { category: 'Muy Bueno', color: 'text-green-600', bgColor: 'bg-green-50' };
  if (score >= 670) return { category: 'Bueno', color: 'text-blue-600', bgColor: 'bg-blue-50' };
  if (score >= 580) return { category: 'Regular', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  return { category: 'Pobre', color: 'text-red-600', bgColor: 'bg-red-50' };
}

/**
 * Formatea fecha en español o inglés.
 */
export function formatDate(date: string | Date, locale: 'es' | 'en' = 'es'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calcula días desde una fecha.
 */
export function daysSince(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Sleep helper para mock data y delays.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Pricing tier por slug.
 */
export const PRICING_TIERS = {
  monitoring: { name: 'Monitoring', price: 9.99, displayPrice: '$9.99' },
  basic: { name: 'Basic', price: 19.99, displayPrice: '$19.99' },
  pro: { name: 'Pro', price: 79.99, displayPrice: '$79.99' },
  proPlus: { name: 'Pro Plus', price: 149.99, displayPrice: '$149.99' },
} as const;

export type PricingTier = keyof typeof PRICING_TIERS;
