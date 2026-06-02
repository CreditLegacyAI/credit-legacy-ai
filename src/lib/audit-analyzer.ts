/**
 * Audit Analyzer
 *
 * Uses Claude Sonnet 4.6 to analyze a structured credit report JSON
 * and identify disputable items under FCRA.
 *
 * Returns:
 *   - Executive summary (bilingual)
 *   - List of disputable items with priority + legal basis
 *   - Estimated score impact per item
 */

import Anthropic from '@anthropic-ai/sdk';
import type { StructuredCreditReport } from './credit-report-structurer';

const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929';

// Pricing for cost estimation (Sonnet 4.5 rates - approximate)
const PRICE_PER_INPUT_TOKEN = 3 / 1_000_000; // $3 per 1M input tokens
const PRICE_PER_OUTPUT_TOKEN = 15 / 1_000_000; // $15 per 1M output tokens

export interface AnalyzedDisputableItem {
  category:
    | 'personal_info'
    | 'incorrect_balance'
    | 'incorrect_status'
    | 'incorrect_dates'
    | 'duplicate_account'
    | 'not_mine'
    | 'outdated'
    | 'collection'
    | 'charge_off'
    | 'late_payment'
    | 'hard_inquiry'
    | 'public_record'
    | 'mixed_file'
    | 'other';
  priority: 'high' | 'medium' | 'low';
  estimatedScoreImpact: number; // points if removed
  affectedBureaus: ('equifax' | 'experian' | 'transunion')[];
  creditorName?: string;
  accountNumberMasked?: string;
  accountType?: string;
  descriptionEs: string;
  descriptionEn: string;
  legalBasis: string; // FCRA section
  recommendedRound: 1 | 2 | 3 | 4 | 5;
  rawData?: Record<string, unknown>;
}

export interface AuditAnalysisResult {
  executiveSummaryEs: string;
  executiveSummaryEn: string;
  disputableItems: AnalyzedDisputableItem[];
  overallAssessmentEs: string;
  overallAssessmentEn: string;
  estimatedTotalScoreImpact: number;
  tokenUsage: {
    input: number;
    output: number;
    estimatedCostUsd: number;
  };
}

/**
 * Main analyzer function.
 */
export async function analyzeStructuredReport(
  report: StructuredCreditReport
): Promise<AuditAnalysisResult> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(report);

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  // Extract text response
  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude returned no text response');
  }

  // Parse JSON from response
  const parsed = parseClaudeJsonResponse(textBlock.text);

  // Calculate cost
  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const estimatedCostUsd =
    inputTokens * PRICE_PER_INPUT_TOKEN + outputTokens * PRICE_PER_OUTPUT_TOKEN;

  return {
    executiveSummaryEs: parsed.executiveSummaryEs || '',
    executiveSummaryEn: parsed.executiveSummaryEn || '',
    disputableItems: parsed.disputableItems || [],
    overallAssessmentEs: parsed.overallAssessmentEs || '',
    overallAssessmentEn: parsed.overallAssessmentEn || '',
    estimatedTotalScoreImpact: parsed.estimatedTotalScoreImpact || 0,
    tokenUsage: {
      input: inputTokens,
      output: outputTokens,
      estimatedCostUsd,
    },
  };
}

/**
 * System prompt: defines Claude's role as a credit repair expert.
 */
function buildSystemPrompt(): string {
  return `Eres un experto en reparación de crédito con profundo conocimiento de:
- Fair Credit Reporting Act (FCRA) - 15 U.S.C. § 1681 et seq.
- Credit Repair Organizations Act (CROA)
- Statute of Limitations (SOL) for credit reporting (7-10 years)
- Metro 2 reporting format used by bureaus
- Common errors in credit reports

Tu trabajo es analizar un reporte de crédito estructurado en JSON y producir:

1. Un resumen ejecutivo claro y profesional (en español E inglés)
2. Una lista de items DISPUTABLES con base legal sólida bajo FCRA
3. Priorización inteligente (Round 1 = personal info; Round 2 = high impact)
4. Estimación realista de impacto en score (NO PROMETER MILAGROS)

PRINCIPIOS CRÍTICOS:
- NUNCA inventes información que no esté en el JSON
- NUNCA recomiendes CPN (Credit Profile Numbers) - son ilegales
- SIEMPRE basa cada disputa en una sección específica de FCRA
- Si un item NO es disputable, NO lo incluyas
- Si la calidad del parsing es baja, sé conservador
- Items obvios (errores claros): high priority
- Items que requieren validation: medium priority
- Items técnicos (statute of limitations): según contexto

CATEGORÍAS DE ERRORES (FCRA §1681):
- personal_info: Nombres mal escritos, direcciones viejas, employers incorrectos
- incorrect_balance: Balance que no coincide con realidad
- incorrect_status: Cuenta pagada que aparece como sin pagar
- incorrect_dates: DOFD incorrecto, fechas de apertura/cierre erradas
- duplicate_account: Misma deuda aparece 2+ veces
- not_mine: Cuenta que no pertenece al consumidor
- outdated: Reportada después de los 7 años permitidos
- collection: Colecciones disputables
- charge_off: Charge-offs con errores
- late_payment: Late payments incorrectos
- hard_inquiry: Inquiries sin autorización
- public_record: Bankruptcies, judgments con errores
- mixed_file: Datos de otra persona mezclados
- other: Otros errores no categorizados

BASES LEGALES COMUNES:
- FCRA § 611 (15 USC §1681i): Right to dispute inaccurate information
- FCRA § 605 (15 USC §1681c): Obsolete information (7-year rule)
- FCRA § 609 (15 USC §1681g): Right to demand verification/method of verification
- FCRA § 623 (15 USC §1681s-2): Furnisher responsibilities
- FCRA § 615 (15 USC §1681m): Identity theft protection

FORMATO DE RESPUESTA: Responde ÚNICAMENTE con un objeto JSON válido. No incluyas texto antes o después. No uses markdown code fences. Solo el JSON puro:

{
  "executiveSummaryEs": "Resumen 2-3 párrafos en español...",
  "executiveSummaryEn": "Summary 2-3 paragraphs in English...",
  "overallAssessmentEs": "Evaluación general en español...",
  "overallAssessmentEn": "Overall assessment in English...",
  "estimatedTotalScoreImpact": 85,
  "disputableItems": [
    {
      "category": "incorrect_balance",
      "priority": "high",
      "estimatedScoreImpact": 25,
      "affectedBureaus": ["equifax", "experian"],
      "creditorName": "CAPITAL ONE",
      "accountNumberMasked": "****1234",
      "accountType": "Credit Card",
      "descriptionEs": "Descripción detallada en español de por qué este item es disputable...",
      "descriptionEn": "Detailed description in English of why this item is disputable...",
      "legalBasis": "FCRA § 611 (15 USC §1681i)",
      "recommendedRound": 2
    }
  ]
}`;
}

/**
 * User prompt: the actual data to analyze.
 */
function buildUserPrompt(report: StructuredCreditReport): string {
  // Truncate raw text in accounts to keep prompt manageable
  const compactReport = {
    ...report,
    accounts: report.accounts.map((a) => ({
      ...a,
      rawText: undefined, // strip rawText to reduce tokens
    })),
  };

  return `Analiza este reporte de crédito estructurado y produce el JSON con disputable items siguiendo el formato especificado.

REPORTE ESTRUCTURADO:
\`\`\`json
${JSON.stringify(compactReport, null, 2)}
\`\`\`

CONTEXTO:
- Bureaus presentes: ${report.meta.bureaus.join(', ') || 'desconocido'}
- Calidad del parsing: ${report.meta.parseQuality}
- Total accounts detectados: ${report.meta.totalAccounts}
- Total collections: ${report.meta.totalCollections}
- Total inquiries: ${report.meta.totalInquiries}

Si la calidad del parsing es "low", sé conservador en tus recomendaciones - no inventes items.

Responde ÚNICAMENTE con el objeto JSON, sin texto adicional, sin code fences.`;
}

/**
 * Parse Claude's response, handling potential markdown wrapping.
 */
function parseClaudeJsonResponse(text: string): {
  executiveSummaryEs?: string;
  executiveSummaryEn?: string;
  overallAssessmentEs?: string;
  overallAssessmentEn?: string;
  estimatedTotalScoreImpact?: number;
  disputableItems?: AnalyzedDisputableItem[];
} {
  let cleaned = text.trim();

  // Strip markdown code fences if present
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Try to extract JSON object from text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // Fall through
      }
    }
    console.error('Failed to parse Claude response:', cleaned.substring(0, 500));
    throw new Error('Claude returned invalid JSON');
  }
}
