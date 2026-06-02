import Anthropic from '@anthropic-ai/sdk';

/**
 * Cliente Anthropic configurado para Credit Legacy AI.
 * Solo se usa en server-side (API routes).
 */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/**
 * Modelo por defecto para Credit Legacy AI.
 * Sonnet 4.6 balance ideal entre costo y calidad para análisis de crédito.
 * Si quieres más potencia: 'claude-opus-4-8'. Si quieres más velocidad: 'claude-haiku-4-5'.
 */
export const DEFAULT_MODEL = 'claude-sonnet-4-6';

/**
 * Helper para llamar a Claude con prompt bilingüe.
 * Detecta automáticamente el idioma del prompt y responde en consecuencia.
 */
export async function askClaude({
  system,
  prompt,
  maxTokens = 2048,
  locale = 'es',
}: {
  system?: string;
  prompt: string;
  maxTokens?: number;
  locale?: 'es' | 'en';
}) {
  const localeInstruction =
    locale === 'es'
      ? 'Responde siempre en español neutro y claro.'
      : 'Always respond in clear, neutral English.';

  const systemPrompt = system
    ? `${system}\n\n${localeInstruction}`
    : localeInstruction;

  const response = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock && textBlock.type === 'text' ? textBlock.text : '';
}
