import { describe, it, expect } from 'vitest';
import {
  formatBytes,
  detectPdfSignature,
  validatePdfSignature,
  detectImageSignature,
  validateImageSignature,
  validateFileSize,
} from '../fileValidation';

describe('fileValidation', () => {
  describe('formatBytes', () => {
    it('formats zero, negative, and non-finite bytes safely', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(-100)).toBe('0 B');
      expect(formatBytes(NaN)).toBe('0 B');
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

  describe('detectPdfSignature and validatePdfSignature', () => {
    it('identifies standard %PDF- header at offset 0', () => {
      const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
      expect(detectPdfSignature(bytes)).toBe(true);
    });

    it('identifies %PDF- header preceded by UTF-8 BOM or header comment within 1024 bytes', () => {
      // 3-byte UTF-8 BOM followed by %PDF-
      const bytes = new Uint8Array([0xef, 0xbb, 0xbf, 0x25, 0x50, 0x44, 0x46, 0x2d]);
      expect(detectPdfSignature(bytes)).toBe(true);
    });

    it('rejects non-PDF files', () => {
      const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      expect(detectPdfSignature(bytes)).toBe(false);
      expect(detectPdfSignature(new Uint8Array([0x00, 0x01]))).toBe(false);
    });

    it('validates PDF signature asynchronously from Blob', async () => {
      const validPdfBlob = new Blob(['%PDF-1.4\n1 0 obj...'], { type: 'application/pdf' });
      const invalidBlob = new Blob(['Hello World not a PDF'], { type: 'text/plain' });

      expect(await validatePdfSignature(validPdfBlob)).toBe(true);
      expect(await validatePdfSignature(invalidBlob)).toBe(false);
    });
  });

  describe('detectImageSignature and validateImageSignature', () => {
    it('detects JPEG magic bytes (FF D8 FF)', () => {
      const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      expect(detectImageSignature(bytes)).toBe('jpeg');
    });

    it('detects PNG magic bytes (89 50 4E 47)', () => {
      const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
      expect(detectImageSignature(bytes)).toBe('png');
    });

    it('detects WebP magic bytes (RIFF....WEBP)', () => {
      const bytes = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, // RIFF
        0x00, 0x00, 0x00, 0x00, // length
        0x57, 0x45, 0x42, 0x50, // WEBP
      ]);
      expect(detectImageSignature(bytes)).toBe('webp');
    });

    it('returns null for unknown format or too few bytes', () => {
      expect(detectImageSignature(new Uint8Array([0x00, 0x00]))).toBe(null);
      expect(detectImageSignature(new Uint8Array([0x47, 0x49, 0x46, 0x38]))).toBe(null);
    });

    it('validates image signature asynchronously from Blob', async () => {
      const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const blob = new Blob([pngBytes], { type: 'image/png' });
      expect(await validateImageSignature(blob)).toBe('png');
    });
  });

  describe('validateFileSize', () => {
    it('rejects 0-byte or negative size files', () => {
      expect(validateFileSize({ size: 0, name: 'empty.pdf' }).valid).toBe(false);
      expect(validateFileSize({ size: -10, name: 'corrupt.pdf' }).valid).toBe(false);
    });

    it('accepts files within the 100MB threshold', () => {
      const result = validateFileSize({ size: 5 * 1024 * 1024, name: 'document.pdf' });
      expect(result.valid).toBe(true);
      expect(result.sizeBytes).toBe(5 * 1024 * 1024);
    });

    it('rejects files larger than the 100MB threshold', () => {
      const result = validateFileSize({ size: 105 * 1024 * 1024, name: 'giant.pdf' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('larger than 100 MB');
    });
  });
});
