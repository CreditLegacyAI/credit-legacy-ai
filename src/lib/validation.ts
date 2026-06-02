import { z } from 'zod';

/**
 * Detecta si un número parece ser CPN (Credit Profile Number).
 * Los CPN son ilegales bajo FCRA y deben ser rechazados.
 *
 * Heurísticas:
 * - SSN reales no empiezan con 000, 666, 9xx (excepto ITIN)
 * - ITIN válidos empiezan con 9 y tienen patrón específico
 * - CPN son números generados artificialmente
 */
export function detectCPN(taxId: string): boolean {
  const cleaned = taxId.replace(/[\s-]/g, '');

  if (cleaned.length !== 9) return false;
  if (!/^\d{9}$/.test(cleaned)) return false;

  const firstThree = cleaned.substring(0, 3);
  const middleTwo = cleaned.substring(3, 5);
  const lastFour = cleaned.substring(5, 9);

  // SSN inválidos conocidos
  if (firstThree === '000') return true;
  if (firstThree === '666') return true;
  if (middleTwo === '00') return true;
  if (lastFour === '0000') return true;

  // ITIN válido: 9XX-7X-XXXX o 9XX-8X-XXXX (rangos del IRS)
  if (firstThree[0] === '9') {
    const middleNum = parseInt(middleTwo, 10);
    const validITINRanges = [
      [70, 88], [90, 92], [94, 99],
    ];
    const isValidITIN = validITINRanges.some(
      ([min, max]) => middleNum >= min && middleNum <= max
    );
    if (!isValidITIN) return true; // Posible CPN
  }

  return false;
}

/**
 * Schema de validación de SSN o ITIN.
 */
export const taxIdSchema = z
  .string()
  .min(9, 'Número incompleto')
  .max(11, 'Número demasiado largo')
  .refine(
    (val) => /^\d{3}-?\d{2}-?\d{4}$/.test(val),
    'Formato inválido. Usa: XXX-XX-XXXX'
  )
  .refine(
    (val) => !detectCPN(val),
    'Este número parece ser un CPN. Los CPN son ilegales bajo FCRA. Solo aceptamos SSN o ITIN válidos.'
  );

/**
 * Schema de validación de signup.
 */
export const signupSchema = z.object({
  fullName: z.string().min(2, 'Nombre muy corto').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  locale: z.enum(['es', 'en']),
});

/**
 * Schema de KYC.
 */
export const kycSchema = z.object({
  fullName: z.string().min(2),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  taxId: taxIdSchema,
  taxIdType: z.enum(['SSN', 'ITIN']),
  address: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().length(2),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP inválido'),
  }),
  phone: z.string().regex(/^\+?\d{10,15}$/, 'Teléfono inválido'),
});

/**
 * Schema de waitlist.
 */
export const waitlistSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  locale: z.enum(['es', 'en']).default('es'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type KYCInput = z.infer<typeof kycSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;
