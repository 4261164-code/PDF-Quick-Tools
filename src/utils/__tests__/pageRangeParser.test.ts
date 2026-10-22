import { describe, it, expect } from 'vitest';
import { parsePageRange, parseMultiDocumentSplit } from '../pageRangeParser';

describe('pageRangeParser', () => {
  it('parses single pages and commas correctly', () => {
    const res = parsePageRange('1, 3, 5', 10);
    expect(res.valid).toBe(true);
    expect(res.pages).toEqual([1, 3, 5]);
  });

  it('parses hyphenated ranges correctly', () => {
    const res = parsePageRange('1-4', 10);
    expect(res.valid).toBe(true);
    expect(res.pages).toEqual([1, 2, 3, 4]);
  });

  it('handles combined ranges and single pages with duplicates', () => {
    const res = parsePageRange('1-3, 2, 5, 4-5', 10);
    expect(res.valid).toBe(true);
    expect(res.pages).toEqual([1, 2, 3, 4, 5]);
  });

  it('rejects empty inputs', () => {
    const res = parsePageRange('   ', 10);
    expect(res.valid).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('rejects inverted ranges like 5-2', () => {
    const res = parsePageRange('5-2', 10);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('greater than range end');
  });

  it('rejects out of bounds page numbers', () => {
    const res = parsePageRange('1, 15', 10);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('exceeds total pages');
  });

  it('parses multi document split groups with semicolons', () => {
    const res = parseMultiDocumentSplit('1-2; 3-4', 4);
    expect(res.valid).toBe(true);
    expect(res.groups.length).toBe(2);
    expect(res.groups[0].pages).toEqual([1, 2]);
    expect(res.groups[1].pages).toEqual([3, 4]);
  });
});
