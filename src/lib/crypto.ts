/**
 * Utilidades de cifrado para datos sensibles.
 *
 * En producción, los SSN/ITIN se cifran ANTES de guardarlos en Supabase.
 * Esto agrega una capa adicional sobre el cifrado at-rest que ya hace Supabase.
 *
 * Para Phase 1, usamos Web Crypto API nativa (sin dependencias externas).
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

/**
 * Obtiene la key de cifrado del environment.
 * En desarrollo usa un valor por defecto; en producción DEBE estar configurada.
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const secret = process.env.ENCRYPTION_SECRET;

  if (!secret) {
    throw new Error('ENCRYPTION_SECRET no está configurado. Configúralo en .env.local');
  }

  if (secret.length < 32) {
    throw new Error('ENCRYPTION_SECRET debe tener al menos 32 caracteres');
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret.substring(0, 32));

  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Cifra un string usando AES-256-GCM.
 * Retorna base64 con IV concatenado al inicio.
 */
export async function encrypt(plaintext: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Descifra un string previamente cifrado con encrypt().
 */
export async function decrypt(encrypted: string): Promise<string> {
  const key = await getEncryptionKey();
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));

  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const plaintext = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(plaintext);
}

/**
 * Masquerade de SSN/ITIN para mostrar al usuario.
 * Convierte 123-45-6789 → ***-**-6789
 */
export function maskTaxId(taxId: string): string {
  const cleaned = taxId.replace(/[\s-]/g, '');
  if (cleaned.length !== 9) return '***-**-****';
  return `***-**-${cleaned.substring(5)}`;
}
