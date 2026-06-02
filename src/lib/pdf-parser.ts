/**
 * PDF Parser for Credit Reports
 *
 * Extracts text content from credit report PDFs using pdf-parse.
 * Handles large files (up to 200+ pages) without size limits.
 *
 * NOTE: pdf-parse is CommonJS, so we import it dynamically to keep Next.js happy.
 */

export interface ParsedPDF {
  text: string;
  pageCount: number;
  metadata: {
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
  };
}

/**
 * Extract text from a PDF Buffer.
 * Returns full text content + metadata.
 */
export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  // Dynamic import to avoid Next.js bundling issues with CJS module
  const pdfParse = (await import('pdf-parse')).default;

  try {
    const data = await pdfParse(buffer, {
      // Limit pages to prevent memory issues on extremely large PDFs (>500 pages)
      max: 500,
    });

    return {
      text: data.text || '',
      pageCount: data.numpages || 0,
      metadata: {
        title: data.info?.Title,
        author: data.info?.Author,
        creator: data.info?.Creator,
        producer: data.info?.Producer,
        creationDate: data.info?.CreationDate,
      },
    };
  } catch (error) {
    console.error('PDF parse error:', error);
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Normalize text for better parsing.
 * Removes excessive whitespace, normalizes line breaks, etc.
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Estimate token count for Claude API (rough: ~4 chars per token).
 * Used to calculate cost and decide chunking strategy.
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}
