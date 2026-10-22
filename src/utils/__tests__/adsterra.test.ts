import { describe, it, expect } from 'vitest';

function isSmartlinkConfigured(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length < 10) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

describe('Adsterra Smartlink configuration rules', () => {
  it('is disabled by default when empty or undefined', () => {
    expect(isSmartlinkConfigured(undefined)).toBe(false);
    expect(isSmartlinkConfigured('')).toBe(false);
    expect(isSmartlinkConfigured('   ')).toBe(false);
  });

  it('rejects invalid or non-http URLs', () => {
    expect(isSmartlinkConfigured('javascript:alert(1)')).toBe(false);
    expect(isSmartlinkConfigured('not-a-valid-url')).toBe(false);
  });

  it('accepts valid HTTPS smartlink URL format', () => {
    expect(isSmartlinkConfigured('https://example.com/smartlink/123')).toBe(true);
  });
});
