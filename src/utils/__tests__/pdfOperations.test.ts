import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  mergePdfs,
  extractPdfPages,
  splitPdfIntoFiles,
  rotatePdfPages,
  compressPdf,
  getPdfInfo,
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

describe('pdfOperations', () => {
  it('reads page count from synthetic document', async () => {
    const sample = await createSamplePdf(3);
    const info = await getPdfInfo(sample);
    expect(info.pageCount).toBe(3);
  });

  it('merges two PDF documents into one combined document', async () => {
    const docA = await createSamplePdf(2);
    const docB = await createSamplePdf(3);

    const mergedBytes = await mergePdfs([docA, docB]);
    const mergedDoc = await PDFDocument.load(mergedBytes);

    expect(mergedDoc.getPageCount()).toBe(5);
  });

  it('extracts specific pages accurately', async () => {
    const sample = await createSamplePdf(5);
    const extractedBytes = await extractPdfPages(sample, [2, 4]);

    const extractedDoc = await PDFDocument.load(extractedBytes);
    expect(extractedDoc.getPageCount()).toBe(2);
  });

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

  it('rotates pages by requested angle', async () => {
    const sample = await createSamplePdf(2);
    const rotatedBytes = await rotatePdfPages(sample, 90, [1]);

    const rotatedDoc = await PDFDocument.load(rotatedBytes);
    const pages = rotatedDoc.getPages();

    expect(pages[0].getRotation().angle).toBe(90);
    expect(pages[1].getRotation().angle).toBe(0);
  });

  it('optimizes PDF structure without destroying document', async () => {
    const sample = await createSamplePdf(4);
    const result = await compressPdf(sample);

    expect(result.bytes.byteLength).toBeGreaterThan(0);
    expect(result.originalSize).toBe(sample.byteLength);

    const doc = await PDFDocument.load(result.bytes);
    expect(doc.getPageCount()).toBe(4);
  });
});
