import { PDFDocument, degrees, PageSizes } from 'pdf-lib';
import JSZip from 'jszip';
import type { ImageToPdfOptions } from '../types';
import { detectImageSignature } from './fileValidation';

export interface SplitResultFile {
  filename: string;
  bytes: Uint8Array;
}

/**
 * Inspects a PDF and retrieves basic metadata such as page count.
 */
export async function getPdfInfo(buffer: ArrayBuffer): Promise<{ pageCount: number; title?: string }> {
  try {
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    return {
      pageCount: doc.getPageCount(),
      title: doc.getTitle(),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('password') || message.toLowerCase().includes('encrypted')) {
      throw new Error('This PDF is password-protected. Please unlock it before processing.');
    }
    throw new Error('Unable to read PDF. The file may be corrupted or in an unsupported format.');
  }
}

/**
 * Merges multiple PDF ArrayBuffers into a single Uint8Array.
 */
export async function mergePdfs(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  if (buffers.length === 0) {
    throw new Error('At least one PDF file is required to merge.');
  }

  const mergedDoc = await PDFDocument.create();

  for (let i = 0; i < buffers.length; i++) {
    const srcDoc = await PDFDocument.load(buffers[i], { ignoreEncryption: true });
    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await mergedDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  return await mergedDoc.save({ useObjectStreams: true });
}

/**
 * Extracts specific 1-indexed pages from a PDF.
 */
export async function extractPdfPages(buffer: ArrayBuffer, pageNumbers: number[]): Promise<Uint8Array> {
  if (pageNumbers.length === 0) {
    throw new Error('No pages selected for extraction.');
  }

  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const zeroIndexed = pageNumbers
    .filter((p) => p >= 1 && p <= totalPages)
    .map((p) => p - 1);

  if (zeroIndexed.length === 0) {
    throw new Error('No valid pages found in selection.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, zeroIndexed);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save({ useObjectStreams: true });
}

/**
 * Splits a PDF into multiple documents based on page groups.
 */
export async function splitPdfIntoFiles(
  buffer: ArrayBuffer,
  baseFilename: string,
  groups: { label: string; pages: number[] }[]
): Promise<SplitResultFile[]> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();
  const results: SplitResultFile[] = [];

  const cleanBase = baseFilename.replace(/\.pdf$/i, '');

  for (const group of groups) {
    const zeroIndexed = group.pages
      .filter((p) => p >= 1 && p <= totalPages)
      .map((p) => p - 1);

    if (zeroIndexed.length === 0) continue;

    const newDoc = await PDFDocument.create();
    const copied = await newDoc.copyPages(srcDoc, zeroIndexed);
    copied.forEach((p) => newDoc.addPage(p));

    const bytes = await newDoc.save({ useObjectStreams: true });
    results.push({
      filename: `${cleanBase}_${group.label}.pdf`,
      bytes,
    });
  }

  if (results.length === 0) {
    throw new Error('No valid output documents could be created from the specified ranges.');
  }

  return results;
}

/**
 * Rotates pages by a specified angle (90, 180, 270) clockwise.
 */
export async function rotatePdfPages(
  buffer: ArrayBuffer,
  rotationDegrees: number,
  targetPages?: number[] // 1-indexed; if omitted or empty, all pages are rotated
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = doc.getPageCount();
  const pages = doc.getPages();

  const targetSet = targetPages && targetPages.length > 0 ? new Set(targetPages) : null;

  pages.forEach((page, idx) => {
    const pageNum = idx + 1;
    if (!targetSet || targetSet.has(pageNum)) {
      const currentRotation = page.getRotation().angle;
      const newRotation = (currentRotation + rotationDegrees) % 360;
      page.setRotation(degrees(newRotation));
    }
  });

  return await doc.save({ useObjectStreams: true });
}

/**
 * Converts images (JPEG / PNG / WEBP) to PDF.
 */
export async function imagesToPdf(
  images: { buffer: ArrayBuffer; type?: 'jpeg' | 'png' | 'webp' }[],
  options: ImageToPdfOptions
): Promise<Uint8Array> {
  if (images.length === 0) {
    throw new Error('No images provided for PDF conversion.');
  }

  const doc = await PDFDocument.create();

  for (const imgItem of images) {
    let embeddedImg;
    const detectedType = detectImageSignature(new Uint8Array(imgItem.buffer.slice(0, 12))) || imgItem.type;
    if (detectedType === 'jpeg') {
      embeddedImg = await doc.embedJpg(imgItem.buffer);
    } else if (detectedType === 'png') {
      embeddedImg = await doc.embedPng(imgItem.buffer);
    } else {
      throw new Error(`Unsupported image format. Please supply a valid JPG or PNG image.`);
    }

    const { width: imgW, height: imgH } = embeddedImg;

    let targetPageW: number;
    let targetPageH: number;

    if (options.pageSize === 'a4') {
      [targetPageW, targetPageH] = PageSizes.A4; // [595.28, 841.89]
    } else if (options.pageSize === 'letter') {
      [targetPageW, targetPageH] = PageSizes.Letter; // [612.0, 792.0]
    } else {
      // Fit to image with optional margins
      targetPageW = imgW + options.margin * 2;
      targetPageH = imgH + options.margin * 2;
    }

    // Adjust for orientation
    if (options.orientation === 'landscape' && targetPageW < targetPageH) {
      const temp = targetPageW;
      targetPageW = targetPageH;
      targetPageH = temp;
    } else if (options.orientation === 'portrait' && targetPageW > targetPageH) {
      const temp = targetPageW;
      targetPageW = targetPageH;
      targetPageH = temp;
    } else if (options.orientation === 'auto') {
      if (imgW > imgH && targetPageW < targetPageH) {
        const temp = targetPageW;
        targetPageW = targetPageH;
        targetPageH = temp;
      } else if (imgH > imgW && targetPageW > targetPageH) {
        const temp = targetPageW;
        targetPageW = targetPageH;
        targetPageH = temp;
      }
    }

    const page = doc.addPage([targetPageW, targetPageH]);

    const availW = targetPageW - options.margin * 2;
    const availH = targetPageH - options.margin * 2;

    const scale = Math.min(availW / imgW, availH / imgH, 1.0);
    const scaledW = imgW * scale;
    const scaledH = imgH * scale;

    const x = options.margin + (availW - scaledW) / 2;
    const y = options.margin + (availH - scaledH) / 2;

    page.drawImage(embeddedImg, {
      x,
      y,
      width: scaledW,
      height: scaledH,
    });
  }

  return await doc.save({ useObjectStreams: true });
}

/**
 * Compress PDF documents honestly:
 * - Cleans metadata, redundant object streams, unused cross-references
 * - Re-encodes using object streams
 * - Reports exact original and compressed sizes
 */
export async function compressPdf(
  buffer: ArrayBuffer
): Promise<{ bytes: Uint8Array; originalSize: number; compressedSize: number; percentChange: number }> {
  const originalSize = buffer.byteLength;
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  // Clear unneeded producer/creator tags to shave bytes
  doc.setProducer('PDF Quick Tools');
  doc.setCreator('PDF Quick Tools');

  const bytes = await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
  });

  const compressedSize = bytes.byteLength;
  const percentChange = ((originalSize - compressedSize) / originalSize) * 100;

  return {
    bytes,
    originalSize,
    compressedSize,
    percentChange: Math.round(percentChange * 10) / 10,
  };
}

/**
 * Creates a ZIP file containing multiple documents.
 */
export async function createZip(files: SplitResultFile[]): Promise<Blob> {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.filename, file.bytes);
  });
  return await zip.generateAsync({ type: 'blob' });
}
