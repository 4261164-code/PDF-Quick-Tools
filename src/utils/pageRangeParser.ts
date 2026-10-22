/**
 * Parse and validate page ranges (e.g., "1-3, 5, 7-10")
 */

export interface PageRangeResult {
  valid: boolean;
  pages: number[]; // 1-indexed page numbers
  error?: string;
}

export function parsePageRange(input: string, maxPages: number): PageRangeResult {
  const clean = input.trim();
  if (!clean) {
    return { valid: false, pages: [], error: 'Please enter at least one page number or range.' };
  }

  const parts = clean.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) {
    return { valid: false, pages: [], error: 'Invalid page range format.' };
  }

  const pageSet = new Set<number>();

  for (const part of parts) {
    if (part.includes('-')) {
      const bounds = part.split('-').map((b) => b.trim());
      if (bounds.length !== 2) {
        return { valid: false, pages: [], error: `Invalid range format: "${part}"` };
      }

      const start = parseInt(bounds[0], 10);
      const end = parseInt(bounds[1], 10);

      if (isNaN(start) || isNaN(end)) {
        return { valid: false, pages: [], error: `Range must contain valid numbers: "${part}"` };
      }

      if (start < 1) {
        return { valid: false, pages: [], error: `Page numbers must be 1 or greater: "${part}"` };
      }

      if (start > end) {
        return { valid: false, pages: [], error: `Range start cannot be greater than range end: "${part}"` };
      }

      if (end > maxPages) {
        return {
          valid: false,
          pages: [],
          error: `Page ${end} exceeds total pages in document (${maxPages}).`,
        };
      }

      for (let i = start; i <= end; i++) {
        pageSet.add(i);
      }
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page)) {
        return { valid: false, pages: [], error: `"${part}" is not a valid page number.` };
      }
      if (page < 1) {
        return { valid: false, pages: [], error: `Page numbers must be 1 or greater.` };
      }
      if (page > maxPages) {
        return {
          valid: false,
          pages: [],
          error: `Page ${page} exceeds total pages in document (${maxPages}).`,
        };
      }
      pageSet.add(page);
    }
  }

  const sortedPages = Array.from(pageSet).sort((a, b) => a - b);
  return {
    valid: true,
    pages: sortedPages,
  };
}

export interface SplitGroup {
  label: string;
  pages: number[]; // 1-indexed
}

export function parseMultiDocumentSplit(input: string, maxPages: number): { valid: boolean; groups: SplitGroup[]; error?: string } {
  const clean = input.trim();
  if (!clean) {
    return { valid: false, groups: [], error: 'Please enter page ranges to split.' };
  }

  const parts = clean.split(';').map((p) => p.trim()).filter(Boolean);
  const segments = parts.length > 1 ? parts : clean.split(',').map((p) => p.trim()).filter(Boolean);

  const groups: SplitGroup[] = [];

  for (let i = 0; i < segments.length; i++) {
    const res = parsePageRange(segments[i], maxPages);
    if (!res.valid) {
      return { valid: false, groups: [], error: res.error };
    }
    groups.push({
      label: `Part_${i + 1}_(Pages_${res.pages.join('_')})`,
      pages: res.pages,
    });
  }

  return { valid: true, groups };
}
