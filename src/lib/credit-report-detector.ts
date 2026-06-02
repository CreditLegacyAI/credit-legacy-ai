/**
 * Credit Report Detector
 *
 * Analyzes the raw text of a parsed PDF to determine:
 *   1. The source (Equifax, Experian, TransUnion, MyFICO 3B, etc.)
 *   2. The report type (single bureau vs tri-merge)
 *   3. Basic metadata (date, scores)
 *
 * Detection is based on header keywords, branding, and structural patterns.
 */

export type BureauName = 'equifax' | 'experian' | 'transunion';
export type ReportSource = BureauName | 'myfico_3b' | 'credit_karma' | 'annual_credit_report' | 'unknown';

export interface DetectionResult {
  source: ReportSource;
  bureaus: BureauName[];
  isTriMerge: boolean;
  scores: {
    equifax?: number;
    experian?: number;
    transunion?: number;
  };
  reportDate?: string; // ISO format
  confidence: 'high' | 'medium' | 'low';
}

// Bureau-specific keywords that appear in headers/footers
const EQUIFAX_KEYWORDS = [
  'equifax',
  'efx',
  'equifax credit report',
  'equifax information services',
];

const EXPERIAN_KEYWORDS = [
  'experian',
  'experian credit report',
  'experian information solutions',
];

const TRANSUNION_KEYWORDS = [
  'transunion',
  'trans union',
  'tu credit report',
  'transunion llc',
];

const MYFICO_KEYWORDS = [
  'myfico',
  'my fico',
  'fico 3b',
  '3-bureau report',
  '3-bureau credit report',
  'tri-merge',
  'three bureau',
];

const CREDIT_KARMA_KEYWORDS = ['credit karma', 'creditkarma'];

const ANNUAL_KEYWORDS = [
  'annualcreditreport.com',
  'annual credit report',
];

/**
 * Detect the source and bureaus present in a credit report text.
 */
export function detectReport(text: string): DetectionResult {
  const lower = text.toLowerCase();

  // Count keyword occurrences
  const counts = {
    equifax: countMatches(lower, EQUIFAX_KEYWORDS),
    experian: countMatches(lower, EXPERIAN_KEYWORDS),
    transunion: countMatches(lower, TRANSUNION_KEYWORDS),
    myfico: countMatches(lower, MYFICO_KEYWORDS),
    creditKarma: countMatches(lower, CREDIT_KARMA_KEYWORDS),
    annual: countMatches(lower, ANNUAL_KEYWORDS),
  };

  // Determine present bureaus (threshold: 3+ mentions = likely contains that bureau's data)
  const bureausPresent: BureauName[] = [];
  if (counts.equifax >= 3) bureausPresent.push('equifax');
  if (counts.experian >= 3) bureausPresent.push('experian');
  if (counts.transunion >= 3) bureausPresent.push('transunion');

  // Determine source
  let source: ReportSource = 'unknown';
  let confidence: 'high' | 'medium' | 'low' = 'low';

  if (counts.myfico >= 2 || bureausPresent.length === 3) {
    source = 'myfico_3b';
    confidence = counts.myfico >= 2 ? 'high' : 'medium';
  } else if (counts.creditKarma >= 2) {
    source = 'credit_karma';
    confidence = 'high';
  } else if (counts.annual >= 2 && bureausPresent.length === 1) {
    source = 'annual_credit_report';
    confidence = 'medium';
  } else if (bureausPresent.length === 1) {
    source = bureausPresent[0];
    confidence = 'high';
  } else if (bureausPresent.length === 2) {
    // Pick the bureau with most mentions
    const sorted = bureausPresent.sort((a, b) => counts[b] - counts[a]);
    source = sorted[0];
    confidence = 'medium';
  }

  // Extract scores (FICO scores, range 300-850, usually near bureau name)
  const scores = extractScores(text, bureausPresent);

  // Extract report date
  const reportDate = extractReportDate(text);

  return {
    source,
    bureaus: bureausPresent,
    isTriMerge: bureausPresent.length >= 2 || source === 'myfico_3b',
    scores,
    reportDate,
    confidence,
  };
}

/**
 * Count total matches of an array of keywords in text.
 */
function countMatches(text: string, keywords: string[]): number {
  let count = 0;
  for (const keyword of keywords) {
    // Escape regex special chars
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = text.match(new RegExp(escaped, 'gi'));
    if (matches) count += matches.length;
  }
  return count;
}

/**
 * Extract FICO scores (300-850) per bureau from the text.
 * Looks for patterns like "FICO Score: 720" or "Equifax: 695".
 */
function extractScores(
  text: string,
  bureausPresent: BureauName[]
): { equifax?: number; experian?: number; transunion?: number } {
  const result: { equifax?: number; experian?: number; transunion?: number } = {};

  // Pattern: bureau name within 100 chars of a number in 300-850 range
  const lower = text.toLowerCase();

  const findScoreNear = (bureauKeywords: string[]): number | undefined => {
    for (const keyword of bureauKeywords) {
      const idx = lower.indexOf(keyword);
      if (idx === -1) continue;

      // Search in window [idx, idx + 300] for a 3-digit number 300-850
      const window = text.substring(idx, idx + 300);
      const scoreMatch = window.match(/\b(3\d{2}|[4-7]\d{2}|8[0-4]\d|850)\b/);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[1], 10);
        if (score >= 300 && score <= 850) return score;
      }
    }
    return undefined;
  };

  if (bureausPresent.includes('equifax')) {
    result.equifax = findScoreNear(EQUIFAX_KEYWORDS);
  }
  if (bureausPresent.includes('experian')) {
    result.experian = findScoreNear(EXPERIAN_KEYWORDS);
  }
  if (bureausPresent.includes('transunion')) {
    result.transunion = findScoreNear(TRANSUNION_KEYWORDS);
  }

  return result;
}

/**
 * Extract report generation date.
 * Looks for "Report Date:", "Generated on:", or "As of:" patterns.
 */
function extractReportDate(text: string): string | undefined {
  const patterns = [
    /report\s+date[:\s]+([0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{2,4})/i,
    /generated\s+on[:\s]+([0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{2,4})/i,
    /as\s+of[:\s]+([0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{2,4})/i,
    /date[:\s]+([0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{2,4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const parsed = parseDate(match[1]);
      if (parsed) return parsed;
    }
  }
  return undefined;
}

/**
 * Parse a date string in various US formats to ISO YYYY-MM-DD.
 */
function parseDate(dateStr: string): string | undefined {
  // Try MM/DD/YYYY or MM-DD-YYYY
  const parts = dateStr.split(/[\/-]/);
  if (parts.length !== 3) return undefined;

  let [month, day, year] = parts.map((p) => parseInt(p, 10));
  if (year < 100) year += 2000; // 2-digit year

  if (
    month < 1 || month > 12 ||
    day < 1 || day > 31 ||
    year < 1900 || year > 2100
  ) {
    return undefined;
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
