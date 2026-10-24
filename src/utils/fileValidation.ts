/**
 * File validation and utility helpers for PDF Quick Tools
 */

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeIndex = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeIndex)).toFixed(dm))} ${sizes[safeIndex]}`;
}

/**
 * Checks for the '%PDF-' header sequence (0x25 0x50 0x44 0x46 0x2D)
 * in accordance with the ISO 32000-1 PDF specification (within the first 1024 bytes).
 */
export function detectPdfSignature(bytes: Uint8Array): boolean {
  if (bytes.length < 5) return false;
  const searchLimit = Math.min(bytes.length, 1024);
  for (let i = 0; i <= searchLimit - 5; i++) {
    if (
      bytes[i] === 0x25 && // %
      bytes[i + 1] === 0x50 && // P
      bytes[i + 2] === 0x44 && // D
      bytes[i + 3] === 0x46 && // F
      bytes[i + 4] === 0x2d    // -
    ) {
      return true;
    }
  }
  return false;
}

export async function validatePdfSignature(fileOrBlob: Blob | File): Promise<boolean> {
  try {
    const slice = fileOrBlob.slice(0, 1024);
    const buffer = await slice.arrayBuffer();
    return detectPdfSignature(new Uint8Array(buffer));
  } catch {
    return false;
  }
}

/**
 * Detects image format from binary magic bytes (JPEG, PNG, WebP).
 */
export function detectImageSignature(bytes: Uint8Array): 'jpeg' | 'png' | 'webp' | null {
  if (bytes.length < 3) return null;

  // JPEG: 0xFF, 0xD8, 0xFF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg';
  }

  // PNG: 0x89, 0x50, 0x4E, 0x47 (\x89PNG)
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'png';
  }

  // WEBP: RIFF....WEBP (0x52 0x49 0x46 0x46 .... 0x57 0x45 0x42 0x50)
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'webp';
  }

  return null;
}

export async function validateImageSignature(fileOrBlob: Blob | File): Promise<'jpeg' | 'png' | 'webp' | null> {
  try {
    const slice = fileOrBlob.slice(0, 12);
    const buffer = await slice.arrayBuffer();
    return detectImageSignature(new Uint8Array(buffer));
  } catch {
    return null;
  }
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sizeBytes: number;
}

/**
 * Validates that a file is within memory constraints (default 100MB) and not empty.
 */
export function validateFileSize(
  file: { size: number; name?: string },
  maxBytes: number = 100 * 1024 * 1024
): FileValidationResult {
  const sizeBytes = file.size;
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    return {
      valid: false,
      error: `File ${file.name ? `"${file.name}" ` : ''}is empty (0 bytes).`,
      sizeBytes: 0,
    };
  }
  if (sizeBytes > maxBytes) {
    return {
      valid: false,
      error: `"${file.name || 'File'}" is larger than ${formatBytes(maxBytes)} (${formatBytes(sizeBytes)}). Large files may exceed browser memory.`,
      sizeBytes,
    };
  }
  return { valid: true, sizeBytes };
}
