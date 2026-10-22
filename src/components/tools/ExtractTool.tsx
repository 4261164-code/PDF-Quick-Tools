import React, { useState } from 'react';
import { FileOutput, FileText, Check } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { ProcessingState } from '../../types';
import { getPdfInfo, extractPdfPages } from '../../utils/pdfOperations';
import { parsePageRange } from '../../utils/pageRangeParser';
import { formatBytes } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';

interface ToolProps {
  navigate: (path: string) => void;
}

export const ExtractTool: React.FC<ToolProps> = ({ navigate }) => {
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    size: number;
    pageCount: number;
    buffer: ArrayBuffer;
  } | null>(null);

  const [pageInput, setPageInput] = useState('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    statusMessage: '',
    error: null,
    resultBlob: null,
    resultUrl: null,
    resultFilename: null,
  });

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    try {
      const buffer = await file.arrayBuffer();
      const info = await getPdfInfo(buffer);
      setSelectedFile({
        file,
        name: file.name,
        size: file.size,
        pageCount: info.pageCount,
        buffer,
      });

      // Default selection: page 1
      setPageInput('1');
      setSelectedPages([1]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reading PDF file.';
      setProcessingState((prev) => ({ ...prev, error: msg }));
    }
  };

  const handleInputChange = (val: string) => {
    setPageInput(val);
    if (!selectedFile) return;
    const res = parsePageRange(val, selectedFile.pageCount);
    if (res.valid) {
      setSelectedPages(res.pages);
      setProcessingState((prev) => ({ ...prev, error: null }));
    }
  };

  const togglePage = (pageNum: number) => {
    if (!selectedFile) return;
    let next: number[];
    if (selectedPages.includes(pageNum)) {
      next = selectedPages.filter((p) => p !== pageNum);
    } else {
      next = [...selectedPages, pageNum].sort((a, b) => a - b);
    }
    setSelectedPages(next);
    setPageInput(next.join(', '));
  };

  const handleExtract = async () => {
    if (!selectedFile) return;

    const res = parsePageRange(pageInput, selectedFile.pageCount);
    if (!res.valid || res.pages.length === 0) {
      setProcessingState((prev) => ({
        ...prev,
        error: res.error || 'Please specify valid page numbers to extract.',
      }));
      return;
    }

    trackEvent('processing_started', { tool: 'extract' });

    setProcessingState({
      isProcessing: true,
      progress: 30,
      statusMessage: `Extracting ${res.pages.length} pages...`,
      error: null,
      resultBlob: null,
      resultUrl: null,
      resultFilename: null,
    });

    try {
      const extractedBytes = await extractPdfPages(selectedFile.buffer, res.pages);

      setProcessingState((prev) => ({
        ...prev,
        progress: 85,
        statusMessage: 'Generating extracted PDF...',
      }));

      const blob = new Blob([extractedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename = `${selectedFile.name.replace(/\.pdf$/i, '')}_extracted_pages_${res.pages.join('_')}.pdf`;

      setProcessingState({
        isProcessing: false,
        progress: 100,
        statusMessage: 'Complete',
        error: null,
        resultBlob: blob,
        resultUrl: url,
        resultFilename: filename,
        originalSize: selectedFile.size,
        resultSize: blob.size,
      });

      trackEvent('processing_succeeded', { tool: 'extract' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to extract pages.';
      setProcessingState({
        isProcessing: false,
        progress: 0,
        statusMessage: '',
        error: msg,
        resultBlob: null,
        resultUrl: null,
        resultFilename: null,
      });
      trackEvent('processing_failed', { tool: 'extract' });
    }
  };

  const handleReset = () => {
    if (processingState.resultUrl) {
      URL.revokeObjectURL(processingState.resultUrl);
    }
    setSelectedFile(null);
    setPageInput('');
    setSelectedPages([]);
    setProcessingState({
      isProcessing: false,
      progress: 0,
      statusMessage: '',
      error: null,
      resultBlob: null,
      resultUrl: null,
      resultFilename: null,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-slate-900">
          Home
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Extract Pages</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-semibold mb-3">
          <FileOutput className="w-3.5 h-3.5" />
          <span>Selective Extraction</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Extract PDF Pages Online Free
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Pull selected pages or custom chapters out of any PDF document into a fresh, independent PDF file. Select individual page numbers or input complex ranges like <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-800">1-3, 5, 8-10</code>.
        </p>
      </div>

      <div className="space-y-6">
        {!selectedFile && !processingState.resultUrl && (
          <FileDropzone
            acceptType="pdf"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            title="Drop the PDF to extract pages from"
            subtitle="Upload any multi-page PDF"
          />
        )}

        {selectedFile && !processingState.resultUrl && !processingState.isProcessing && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    <span className="tabular-nums">{formatBytes(selectedFile.size)}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="tabular-nums font-semibold text-slate-800">{selectedFile.pageCount} total pages</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-red-600 p-2"
              >
                Change File
              </button>
            </div>

            {/* Input range text */}
            <div>
              <label htmlFor="pagesInput" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Pages to Extract (Range or Comma List)
              </label>
              <input
                id="pagesInput"
                type="text"
                value={pageInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="e.g. 1-3, 5, 8-10"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 font-mono outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Currently selecting: <span className="font-semibold text-slate-800">{selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'}</span> (Pages: {selectedPages.join(', ') || 'None'})
              </p>
            </div>

            {/* Quick interactive page selector grid (up to 30 pages) */}
            {selectedFile.pageCount <= 40 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Interactive Page Selector
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {Array.from({ length: selectedFile.pageCount }, (_, i) => i + 1).map((num) => {
                    const isSelected = selectedPages.includes(num);
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => togglePage(num)}
                        className={`h-10 rounded border font-mono text-xs font-medium flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                        title={`Toggle page ${num}`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExtract}
                disabled={selectedPages.length === 0}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:pointer-events-none rounded-lg shadow-sm transition-colors"
              >
                Extract {selectedPages.length} Pages
              </button>
            </div>
          </div>
        )}

        <ProcessingCard
          state={processingState}
          onReset={handleReset}
          toolName="extract"
        />
      </div>

      <AdsterraPlacement placementLocation="below-tool" />

      {/* Guide */}
      <section className="mt-16 space-y-6 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">How to Extract Pages from a PDF</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed">
            <strong className="block text-slate-900 text-sm mb-1">1. Stage Document</strong>
            Upload the PDF file you wish to extract portions from. Total page counts are calculated instantly.
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed">
            <strong className="block text-slate-900 text-sm mb-1">2. Pick Target Pages</strong>
            Click the interactive page numbers or type a formula like <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">1-5, 8</code>.
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed">
            <strong className="block text-slate-900 text-sm mb-1">3. Instant Compilation</strong>
            A new standalone PDF file is generated in memory preserving all original styling and vector shapes.
          </div>
        </div>
      </section>

      <RelatedTools currentPath="/extract-pdf-pages" navigate={navigate} />
    </div>
  );
};
