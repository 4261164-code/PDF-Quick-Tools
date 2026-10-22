import { describe, it, expect } from 'vitest';
import { formatBytes } from '../fileValidation';

describe('fileValidation', () => {
  it('formats zero bytes properly', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats kilobytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(2048)).toBe('2 KB');
  });

  it('formats megabytes with decimal precision', () => {
    expect(formatBytes(1572864)).toBe('1.5 MB');
    expect(formatBytes(10485760)).toBe('10 MB');
  });
});
