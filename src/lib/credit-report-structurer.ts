/**
 * Credit Report Structurer
 *
 * Converts raw text from a parsed credit report into structured JSON.
 * Uses regex-based section detection + Claude for ambiguous parsing.
 *
 * Output format is bureau-agnostic and ready for AI analysis.
 */

import type { BureauName } from './credit-report-detector';

export interface PersonalInfo {
  names: string[];
  addresses: string[];
  employers: string[];
  ssnLast4?: string;
  dateOfBirth?: string;
  phoneNumbers?: string[];
}

export interface Account {
  creditorName: string;
  accountNumberMasked?: string;
  accountType?: string; // 'Credit Card', 'Mortgage', 'Auto Loan', 'Collection', etc.
  status?: string; // 'Open', 'Closed', 'Charge-off', etc.
  balance?: number;
  highBalance?: number;
  creditLimit?: number;
  monthlyPayment?: number;
  dateOpened?: string;
  dateOfFirstDelinquency?: string; // DOFD - critical for SOL
  dateClosed?: string;
  dateLastReported?: string;
  paymentStatus?: string;
  paymentHistory?: string; // e.g. "OK OK OK 30 OK OK 60 ..."
  remarks?: string[];
  bureau?: BureauName;
  rawText?: string;
}

export interface Inquiry {
  creditorName: string;
  date: string;
  type: 'hard' | 'soft';
  bureau?: BureauName;
}

export interface PublicRecord {
  type: string; // 'Bankruptcy', 'Judgment', 'Lien', 'Tax Lien'
  status?: string;
  filedDate?: string;
  amount?: number;
  caseNumber?: string;
  bureau?: BureauName;
}

export interface Collection {
  collectorName: string;
  originalCreditor?: string;
  accountNumberMasked?: string;
  balance?: number;
  dateAssigned?: string;
  dateOfFirstDelinquency?: string;
  bureau?: BureauName;
}

export interface StructuredCreditReport {
  personalInfo: PersonalInfo;
  accounts: Account[];
  collections: Collection[];
  inquiries: Inquiry[];
  publicRecords: PublicRecord[];
  meta: {
    bureaus: BureauName[];
    scoresExtracted: {
      equifax?: number;
      experian?: number;
      transunion?: number;
    };
    reportDate?: string;
    totalAccounts: number;
    totalCollections: number;
    totalInquiries: number;
    parseQuality: 'high' | 'medium' | 'low';
    rawTextLength: number;
  };
}

/**
 * Main entry point: convert raw text to structured JSON.
 * This is a fast regex-based extraction. Claude will do deeper analysis later.
 */
export function structureReport(
  rawText: string,
  bureaus: BureauName[],
  scores: { equifax?: number; experian?: number; transunion?: number },
  reportDate?: string
): StructuredCreditReport {
  const sections = splitIntoSections(rawText);

  const personalInfo = extractPersonalInfo(sections.personalInfo || sections.full);
  const accounts = extractAccounts(sections.accounts || sections.full, bureaus);
  const collections = extractCollections(sections.collections || sections.full, bureaus);
  const inquiries = extractInquiries(sections.inquiries || sections.full, bureaus);
  const publicRecords = extractPublicRecords(sections.publicRecords || sections.full, bureaus);

  const parseQuality = assessParseQuality(personalInfo, accounts);

  return {
    personalInfo,
    accounts,
    collections,
    inquiries,
    publicRecords,
    meta: {
      bureaus,
      scoresExtracted: scores,
      reportDate,
      totalAccounts: accounts.length,
      totalCollections: collections.length,
      totalInquiries: inquiries.length,
      parseQuality,
      rawTextLength: rawText.length,
    },
  };
}

/**
 * Split text into common credit report sections.
 */
function splitIntoSections(text: string): Record<string, string> {
  const sections: Record<string, string> = { full: text };

  const sectionPatterns: Record<string, RegExp[]> = {
    personalInfo: [
      /personal\s+information/i,
      /consumer\s+information/i,
      /identifying\s+information/i,
    ],
    accounts: [
      /account\s+information/i,
      /credit\s+accounts/i,
      /trade\s*lines/i,
      /open\s+accounts/i,
    ],
    collections: [
      /collection\s+accounts/i,
      /collections/i,
    ],
    inquiries: [
      /inquiries/i,
      /credit\s+inquiries/i,
      /requests\s+for\s+your\s+credit/i,
    ],
    publicRecords: [
      /public\s+records?/i,
      /bankruptc/i,
      /judgments?/i,
    ],
  };

  for (const [name, patterns] of Object.entries(sectionPatterns)) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        // Take next 50KB or until next section
        sections[name] = text.substring(match.index, match.index + 50000);
        break;
      }
    }
  }

  return sections;
}

/**
 * Extract personal information.
 */
function extractPersonalInfo(text: string): PersonalInfo {
  const result: PersonalInfo = {
    names: [],
    addresses: [],
    employers: [],
  };

  // Name patterns: typically capitalized words after "Name:" or in header
  const nameMatches = text.match(/(?:name|consumer)[:\s]+([A-Z][A-Za-z\s,.'-]{3,50})/gi);
  if (nameMatches) {
    const names = nameMatches
      .map((m) => m.replace(/(name|consumer)[:\s]+/i, '').trim())
      .filter((n) => n.length > 3 && n.length < 60)
      .slice(0, 5);
    result.names = Array.from(new Set(names));
  }

  // Addresses: lines that look like US addresses
  const addressRegex = /\d+\s+[A-Za-z0-9\s,.'-]{5,80}(?:\s+[A-Z]{2}\s+\d{5})/g;
  const addressMatches = text.match(addressRegex);
  if (addressMatches) {
    result.addresses = Array.from(new Set(addressMatches.map((a) => a.trim()))).slice(0, 10);
  }

  // SSN last 4
  const ssnMatch = text.match(/(?:ssn|social).{0,30}?(\d{4})/i);
  if (ssnMatch) result.ssnLast4 = ssnMatch[1];

  // DOB: MM/DD/YYYY format near "DOB" or "Birth"
  const dobMatch = text.match(/(?:dob|birth|date\s+of\s+birth).{0,30}?(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i);
  if (dobMatch) result.dateOfBirth = dobMatch[1];

  // Employers
  const empMatches = text.match(/(?:employer|company)[:\s]+([A-Z][A-Za-z0-9\s&,.'-]{3,60})/gi);
  if (empMatches) {
    const employers = empMatches
      .map((m) => m.replace(/(employer|company)[:\s]+/i, '').trim())
      .filter((e) => e.length > 3 && e.length < 80)
      .slice(0, 5);
    result.employers = Array.from(new Set(employers));
  }

  return result;
}

/**
 * Extract account/tradeline records.
 * Looks for blocks with creditor names + balance + status patterns.
 */
function extractAccounts(text: string, bureaus: BureauName[]): Account[] {
  const accounts: Account[] = [];

  // Split text by potential account boundaries
  // Common indicators: creditor name in caps, account number patterns
  const blocks = text.split(/\n\s*\n/);

  for (const block of blocks) {
    if (block.length < 50 || block.length > 5000) continue; // Skip empty or too large

    // Heuristic: must contain a balance amount and a creditor-like name
    const hasBalance = /\$[\d,]+\.?\d{0,2}/.test(block);
    const hasCreditor = /[A-Z][A-Z0-9\s&]{4,40}/.test(block);

    if (!hasBalance || !hasCreditor) continue;

    const account: Account = {
      creditorName: extractFirstMatch(block, /([A-Z][A-Z0-9\s&]{4,40})/) || 'Unknown',
      accountNumberMasked: extractFirstMatch(block, /(?:account|acct).{0,20}?(\*+\d{2,4}|x+\d{2,4}|\d{2,4})/i),
      accountType: extractAccountType(block),
      status: extractStatus(block),
      balance: extractAmount(block, /balance[:\s]+\$?([\d,]+\.?\d{0,2})/i),
      highBalance: extractAmount(block, /high\s+balance[:\s]+\$?([\d,]+\.?\d{0,2})/i),
      creditLimit: extractAmount(block, /(?:credit\s+limit|limit)[:\s]+\$?([\d,]+\.?\d{0,2})/i),
      monthlyPayment: extractAmount(block, /monthly\s+payment[:\s]+\$?([\d,]+\.?\d{0,2})/i),
      dateOpened: extractDate(block, /(?:opened|date\s+opened)[:\s]+([\d\/-]+)/i),
      dateOfFirstDelinquency: extractDate(block, /(?:dofd|first\s+delinquency)[:\s]+([\d\/-]+)/i),
      dateClosed: extractDate(block, /(?:closed|date\s+closed)[:\s]+([\d\/-]+)/i),
      dateLastReported: extractDate(block, /(?:last\s+reported|reported)[:\s]+([\d\/-]+)/i),
      paymentStatus: extractFirstMatch(block, /payment\s+status[:\s]+([A-Za-z0-9\s]+)/i),
      rawText: block.length > 500 ? block.substring(0, 500) + '...' : block,
    };

    // Add primary bureau if known
    if (bureaus.length === 1) account.bureau = bureaus[0];

    accounts.push(account);
  }

  return accounts.slice(0, 100); // Cap at 100 to avoid pathological cases
}

/**
 * Extract collection accounts.
 */
function extractCollections(text: string, bureaus: BureauName[]): Collection[] {
  const collections: Collection[] = [];

  // Collections often appear as "COLLECTION AGENCY NAME" + amount
  const blocks = text.split(/\n\s*\n/);

  for (const block of blocks) {
    if (block.length < 30 || block.length > 3000) continue;

    const isCollection = /collection|collect/i.test(block);
    if (!isCollection) continue;

    const collection: Collection = {
      collectorName: extractFirstMatch(block, /([A-Z][A-Z0-9\s&]{4,40})/) || 'Unknown',
      originalCreditor: extractFirstMatch(block, /original\s+creditor[:\s]+([A-Za-z0-9\s&,.'-]{3,60})/i),
      accountNumberMasked: extractFirstMatch(block, /(?:account|acct).{0,20}?(\*+\d{2,4}|x+\d{2,4}|\d{2,4})/i),
      balance: extractAmount(block, /(?:balance|amount)[:\s]+\$?([\d,]+\.?\d{0,2})/i),
      dateAssigned: extractDate(block, /(?:assigned|reported)[:\s]+([\d\/-]+)/i),
      dateOfFirstDelinquency: extractDate(block, /(?:dofd|first\s+delinquency)[:\s]+([\d\/-]+)/i),
    };

    if (bureaus.length === 1) collection.bureau = bureaus[0];

    collections.push(collection);
  }

  return collections.slice(0, 50);
}

/**
 * Extract credit inquiries.
 */
function extractInquiries(text: string, bureaus: BureauName[]): Inquiry[] {
  const inquiries: Inquiry[] = [];

  // Pattern: creditor name + date, often in inquiries section
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.length < 10 || line.length > 200) continue;

    // Must contain a date
    const dateMatch = line.match(/(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/);
    if (!dateMatch) continue;

    const creditor = extractFirstMatch(line, /^([A-Z][A-Z0-9\s&,.'-]{3,40})/);
    if (!creditor) continue;

    inquiries.push({
      creditorName: creditor.trim(),
      date: dateMatch[1],
      type: /soft/i.test(line) ? 'soft' : 'hard', // Default to hard unless explicit
      bureau: bureaus.length === 1 ? bureaus[0] : undefined,
    });
  }

  return inquiries.slice(0, 100);
}

/**
 * Extract public records.
 */
function extractPublicRecords(text: string, bureaus: BureauName[]): PublicRecord[] {
  const records: PublicRecord[] = [];

  const patterns = [
    { type: 'Bankruptcy', regex: /bankruptcy/i },
    { type: 'Judgment', regex: /judgment/i },
    { type: 'Tax Lien', regex: /tax\s+lien/i },
    { type: 'Lien', regex: /\blien\b/i },
  ];

  for (const { type, regex } of patterns) {
    const matches = text.match(new RegExp(regex.source + '.{0,500}', 'gi'));
    if (!matches) continue;

    for (const match of matches) {
      records.push({
        type,
        status: extractFirstMatch(match, /status[:\s]+([A-Za-z\s]+)/i),
        filedDate: extractDate(match, /(?:filed|date)[:\s]+([\d\/-]+)/i),
        amount: extractAmount(match, /amount[:\s]+\$?([\d,]+\.?\d{0,2})/i),
        caseNumber: extractFirstMatch(match, /(?:case|docket)[:\s#]+([A-Z0-9-]+)/i),
        bureau: bureaus.length === 1 ? bureaus[0] : undefined,
      });
    }
  }

  return records;
}

// --- Helper utilities ---

function extractFirstMatch(text: string, regex: RegExp): string | undefined {
  const match = text.match(regex);
  return match && match[1] ? match[1].trim() : undefined;
}

function extractAmount(text: string, regex: RegExp): number | undefined {
  const match = text.match(regex);
  if (!match || !match[1]) return undefined;
  const num = parseFloat(match[1].replace(/,/g, ''));
  return isNaN(num) ? undefined : num;
}

function extractDate(text: string, regex: RegExp): string | undefined {
  const match = text.match(regex);
  return match && match[1] ? match[1].trim() : undefined;
}

function extractAccountType(text: string): string | undefined {
  const types = [
    'Credit Card',
    'Mortgage',
    'Auto Loan',
    'Student Loan',
    'Personal Loan',
    'Line of Credit',
    'Installment',
    'Revolving',
    'Collection',
    'Charge-off',
  ];
  for (const type of types) {
    if (new RegExp(type.replace(/[-\s]/g, '[-\\s]?'), 'i').test(text)) {
      return type;
    }
  }
  return undefined;
}

function extractStatus(text: string): string | undefined {
  const statuses = [
    'Open',
    'Closed',
    'Paid',
    'Charge-off',
    'Charge off',
    'In Collections',
    'Past Due',
    'Current',
    'Delinquent',
    'Settled',
    'Discharged',
  ];
  for (const status of statuses) {
    const regex = new RegExp(`\\bstatus[:\\s]+${status.replace(/[-\s]/g, '[-\\s]?')}\\b`, 'i');
    if (regex.test(text)) return status;
  }
  return undefined;
}

/**
 * Assess overall parse quality.
 * High = extracted personal info + 5+ accounts.
 * Medium = some data extracted.
 * Low = very little extracted (Claude will need to do most work).
 */
function assessParseQuality(personalInfo: PersonalInfo, accounts: Account[]): 'high' | 'medium' | 'low' {
  const hasPersonalInfo = personalInfo.names.length > 0 || personalInfo.addresses.length > 0;
  const hasAccounts = accounts.length;

  if (hasPersonalInfo && hasAccounts >= 5) return 'high';
  if (hasPersonalInfo || hasAccounts >= 2) return 'medium';
  return 'low';
}
