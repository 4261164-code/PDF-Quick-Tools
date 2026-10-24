import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  mergePdfs,
  extractPdfPages,
  splitPdfIntoFiles,
  rotatePdfPages,
  compressPdf,
  getPdfInfo,
  imagesToPdf,
  createZip,
} from '../pdfOperations';

async function createSamplePdf(pageCount: number): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([400, 600]);
    page.drawText(`Page ${i + 1}`);
  }
  const bytes = await doc.save();
  return bytes.buffer as ArrayBuffer;
}

// 1x1 valid RGBA PNG binary
const sample1x1Png = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
  0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
  0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
  0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
  0x42, 0x60, 0x82
]);

describe('pdfOperations', () => {
  describe('getPdfInfo', () => {
    it('reads page count from synthetic document', async () => {
      const sample = await createSamplePdf(3);
      const info = await getPdfInfo(sample);
      expect(info.pageCount).toBe(3);
    });

    it('rejects corrupt binary with informative error', async () => {
      const corruptBuffer = new TextEncoder().encode('Not a valid PDF').buffer;
      await expect(getPdfInfo(corruptBuffer)).rejects.toThrow(/Unable to read PDF/);
    });
  });

  describe('mergePdfs', () => {
    it('merges two PDF documents into one combined document', async () => {
      const docA = await createSamplePdf(2);
      const docB = await createSamplePdf(3);

      const mergedBytes = await mergePdfs([docA, docB]);
      const mergedDoc = await PDFDocument.load(mergedBytes);

      expect(mergedDoc.getPageCount()).toBe(5);
    });

    it('throws error when no buffers are provided to merge', async () => {
      await expect(mergePdfs([])).rejects.toThrow(/At least one PDF file is required/);
    });
  });

  describe('extractPdfPages', () => {
    it('extracts specific pages accurately', async () => {
      const sample = await createSamplePdf(5);
      const extractedBytes = await extractPdfPages(sample, [2, 4]);

      const extractedDoc = await PDFDocument.load(extractedBytes);
      expect(extractedDoc.getPageCount()).toBe(2);
    });

    it('throws error if page numbers are empty or out of range', async () => {
      const sample = await createSamplePdf(3);
      await expect(extractPdfPages(sample, [])).rejects.toThrow(/No pages selected/);
      await expect(extractPdfPages(sample, [99, 100])).rejects.toThrow(/No valid pages found/);
    });
  });

  describe('splitPdfIntoFiles', () => {
    it('splits a PDF into multiple distinct files', async () => {
      const sample = await createSamplePdf(6);
      const groups = [
        { label: 'Part1', pages: [1, 2] },
        { label: 'Part2', pages: [3, 4, 5, 6] },
      ];

      const results = await splitPdfIntoFiles(sample, 'doc.pdf', groups);
      expect(results.length).toBe(2);

      const part1Doc = await PDFDocument.load(results[0].bytes);
      expect(part1Doc.getPageCount()).toBe(2);

      const part2Doc = await PDFDocument.load(results[1].bytes);
      expect(part2Doc.getPageCount()).toBe(4);
    });
  });

  describe('rotatePdfPages', () => {
    it('rotates pages by requested angle', async () => {
      const sample = await createSamplePdf(2);
      const rotatedBytes = await rotatePdfPages(sample, 90, [1]);

      const rotatedDoc = await PDFDocument.load(rotatedBytes);
      const pages = rotatedDoc.getPages();

      expect(pages[0].getRotation().angle).toBe(90);
      expect(pages[1].getRotation().angle).toBe(0);
    });
  });

  describe('compressPdf', () => {
    it('optimizes PDF structure without destroying document', async () => {
      const sample = await createSamplePdf(4);
      const result = await compressPdf(sample);

      expect(result.bytes.byteLength).toBeGreaterThan(0);
      expect(result.originalSize).toBe(sample.byteLength);

      const doc = await PDFDocument.load(result.bytes);
      expect(doc.getPageCount()).toBe(4);
    });
  });

  describe('imagesToPdf', () => {
    it('converts PNG image into a valid PDF page', async () => {
      const result = await imagesToPdf(
        [{ buffer: sample1x1Png.buffer as ArrayBuffer, type: 'png' }],
        { pageSize: 'a4', orientation: 'portrait', margin: 18 }
      );

      const doc = await PDFDocument.load(result);
      expect(doc.getPageCount()).toBe(1);
    });
  });

  describe('createZip', () => {
    it('packages multiple split files into a valid ZIP blob', async () => {
      const files = [
        { filename: 'test1.pdf', bytes: new Uint8Array([1, 2, 3]) },
        { filename: 'test2.pdf', bytes: new Uint8Array([4, 5, 6]) },
      ];

      const zipBlob = await createZip(files);
      expect(zipBlob.size).toBeGreaterThan(0);
      expect(zipBlob.type).toContain('zip');
    });
  });
});
