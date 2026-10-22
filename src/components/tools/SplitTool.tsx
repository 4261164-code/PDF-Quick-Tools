import React, { useState } from 'react';
import { Scissors, FileText, Download, Archive, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { ProcessingState } from '../../types';
import { getPdfInfo, splitPdfIntoFiles, createZip } from '../../utils/pdfOperations';
import { parsePageRange, parseMultiDocumentSplit } from '../../utils/pageRangeParser';
import { formatBytes } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';

interface ToolProps {
  navigate: (path: string) => void;
}

interface RangeSegment {
  id: string;
  label: string;
  rangeText: string;
}

export const SplitTool: React.FC<ToolProps> = ({ navigate }) => {
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    size: number;
    pageCount: number;
    buffer: ArrayBuffer;
  } | null>(null);

  const [splitMode, setSplitMode] = useState<'ranges' | 'every-page'>('ranges');
  const [rangeSegments, setRangeSegments] = useState<RangeSegment[]>([
    { id: '1', label: 'Part 1', rangeText: '1' },
  ]);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [splitOutputs, setSplitOutputs] = useState<{ filename: string; bytes: Uint8Array; url: string }[]>([]);

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

      // Initialize sensible default ranges based on page count
      if (info.pageCount > 1) {
        const half = Math.floor(info.pageCount / 2);
        setRangeSegments([
          { id: '1', label: 'Section 1', rangeText: `1-${half}` },
          { id: '2', label: 'Section 2', rangeText: `${half + 1}-${info.pageCount}` },
        ]);
      } else {
        setRangeSegments([{ id: '1', label: 'Part 1', rangeText: '1' }]);
      }
      setValidationErrors({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reading PDF file.';
      setProcessingState((prev) => ({ ...prev, error: msg }));
    }
  };

  const handleRangeChange = (id: string, text: string) => {
    setRangeSegments((prev) =>
      prev.map((seg) => (seg.id === id ? { ...seg, rangeText: text } : seg))
    );

    if (selectedFile) {
      const res = parsePageRange(text, selectedFile.pageCount);
      setValidationErrors((prev) => {
        const next = { ...prev };
        if (!res.valid) {
          next[id] = res.error || 'Invalid range';
        } else {
          delete next[id];
        }
        return next;
      });
    }
  };

  const handleLabelChange = (id: string, label: string) => {
    setRangeSegments((prev) =>
      prev.map((seg) => (seg.id === id ? { ...seg, label } : seg))
    );
  };

  const addRange = () => {
    if (!selectedFile) return;
    const nextNum = rangeSegments.length + 1;
    setRangeSegments((prev) => [
      ...prev,
      { id: `${Date.now()}`, label: `Section ${nextNum}`, rangeText: '' },
    ]);
  };

  const removeRange = (id: string) => {
    if (rangeSegments.length <= 1) return;
    setRangeSegments((prev) => prev.filter((s) => s.id !== id));
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const applyPreset = (preset: 'even' | 'odd' | 'halves') => {
    if (!selectedFile) return;
    const total = selectedFile.pageCount;

    if (preset === 'halves' && total > 1) {
      const half = Math.floor(total / 2);
      setRangeSegments([
        { id: '1', label: 'First Half', rangeText: `1-${half}` },
        { id: '2', label: 'Second Half', rangeText: `${half + 1}-${total}` },
      ]);
    } else if (preset === 'odd') {
      const odds = Array.from({ length: total }, (_, i) => i + 1).filter((n) => n % 2 !== 0);
      setRangeSegments([{ id: '1', label: 'Odd Pages', rangeText: odds.join(', ') }]);
    } else if (preset === 'even' && total > 1) {
      const evens = Array.from({ length: total }, (_, i) => i + 1).filter((n) => n % 2 === 0);
      setRangeSegments([{ id: '1', label: 'Even Pages', rangeText: evens.join(', ') }]);
    }
    setValidationErrors({});
  };

  const handleSplit = async () => {
    if (!selectedFile) return;

    let groups: { label: string; pages: number[] }[] = [];

    if (splitMode === 'every-page') {
      for (let i = 1; i <= selectedFile.pageCount; i++) {
        groups.push({
          label: `Page_${i}`,
          pages: [i],
        });
      }
    } else {
      // Validate all ranges
      const errors: Record<string, string> = {};
      for (const seg of rangeSegments) {
        const res = parsePageRange(seg.rangeText, selectedFile.pageCount);
        if (!res.valid || res.pages.length === 0) {
          errors[seg.id] = res.error || 'Please enter a valid page number or range.';
        } else {
          groups.push({
            label: seg.label.trim().replace(/\s+/g, '_') || `Part_${seg.rangeText}`,
            pages: res.pages,
          });
        }
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setProcessingState((prev) => ({
          ...prev,
          error: 'Please fix the highlighted invalid page ranges before splitting.',
        }));
        return;
      }
    }

    trackEvent('processing_started', { tool: 'split' });

    setProcessingState({
      isProcessing: true,
      progress: 30,
      statusMessage: `Extracting ${groups.length} separate PDF outputs...`,
      error: null,
      resultBlob: null,
      resultUrl: null,
      resultFilename: null,
    });

    try {
      const filesResult = await splitPdfIntoFiles(selectedFile.buffer, selectedFile.name, groups);

      // Clean old blob URLs
      splitOutputs.forEach((f) => URL.revokeObjectURL(f.url));

      const newOutputs = filesResult.map((f) => ({
        filename: f.filename,
        bytes: f.bytes,
        url: URL.createObjectURL(new Blob([f.bytes.buffer as ArrayBuffer], { type: 'application/pdf' })),
      }));

      setSplitOutputs(newOutputs);

      setProcessingState((prev) => ({
        ...prev,
        progress: 80,
        statusMessage: 'Bundling split documents into ZIP archive...',
      }));

      const zipBlob = await createZip(filesResult);
      const zipUrl = URL.createObjectURL(zipBlob);
      const zipName = `${selectedFile.name.replace(/\.pdf$/i, '')}_split_pages.zip`;

      setProcessingState({
        isProcessing: false,
        progress: 100,
        statusMessage: 'Complete',
        error: null,
        resultBlob: zipBlob,
        resultUrl: zipUrl,
        resultFilename: zipName,
        originalSize: selectedFile.size,
        resultSize: zipBlob.size,
      });

      trackEvent('processing_succeeded', { tool: 'split' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error splitting PDF';
      setProcessingState({
        isProcessing: false,
        progress: 0,
        statusMessage: '',
        error: msg,
        resultBlob: null,
        resultUrl: null,
        resultFilename: null,
      });
      trackEvent('processing_failed', { tool: 'split' });
    }
  };

  const handleReset = () => {
    if (processingState.resultUrl) {
      URL.revokeObjectURL(processingState.resultUrl);
    }
    splitOutputs.forEach((f) => URL.revokeObjectURL(f.url));
    setSplitOutputs([]);
    setSelectedFile(null);
    setRangeSegments([{ id: '1', label: 'Part 1', rangeText: '1' }]);
    setValidationErrors({});
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
        <span className="text-slate-900 font-medium">Split PDF</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-semibold mb-3">
          <Scissors className="w-3.5 h-3.5" />
          <span>Page Range Extraction</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Split PDF Pages Online Free
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Upload any PDF document, validate page ranges against actual page counts, and extract specific sections. Download individual files or grab all separated documents in a ZIP archive.
        </p>
      </div>

      <div className="space-y-6">
        {!selectedFile && !processingState.resultUrl && (
          <FileDropzone
            acceptType="pdf"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            title="Drop the PDF file to split here"
            subtitle="Select any multi-page PDF document"
          />
        )}

        {selectedFile && !processingState.resultUrl && !processingState.isProcessing && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            {/* File Info Header */}
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
                    <span className="tabular-nums font-semibold text-slate-800">
                      {selectedFile.pageCount} total {selectedFile.pageCount === 1 ? 'page' : 'pages'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-red-600 p-2 font-medium"
              >
                Change File
              </button>
            </div>

            {/* Split Mode Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Splitting Method
                </label>
                {splitMode === 'ranges' && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Presets:</span>
                    <button
                      type="button"
                      onClick={() => applyPreset('halves')}
                      className="text-red-600 hover:underline font-medium"
                    >
                      In Halves
                    </button>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => applyPreset('odd')}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Odd Pages
                    </button>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => applyPreset('even')}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Even Pages
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSplitMode('ranges')}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    splitMode === 'ranges'
                      ? 'border-red-600 bg-red-50/20 text-slate-900 ring-1 ring-red-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="text-sm font-semibold">Custom Page Ranges</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Group specific pages into separate files (e.g. 1-3, 5, 8-10)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSplitMode('every-page')}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    splitMode === 'every-page'
                      ? 'border-red-600 bg-red-50/20 text-slate-900 ring-1 ring-red-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="text-sm font-semibold">Extract Every Page</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Export all {selectedFile.pageCount} pages as individual single-page documents
                  </p>
                </button>
              </div>

              {/* Range Builder */}
              {splitMode === 'ranges' && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">
                      Output Documents ({rangeSegments.length})
                    </span>
                    <button
                      type="button"
                      onClick={addRange}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another Range</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {rangeSegments.map((seg, idx) => {
                      const err = validationErrors[seg.id];
                      return (
                        <div
                          key={seg.id}
                          className="p-3 bg-slate-50/80 border border-slate-200 rounded-lg space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={seg.label}
                              onChange={(e) => handleLabelChange(seg.id, e.target.value)}
                              placeholder={`Part ${idx + 1}`}
                              className="w-1/3 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded font-medium text-slate-800 focus:border-red-600 focus:outline-hidden"
                            />
                            <input
                              type="text"
                              value={seg.rangeText}
                              onChange={(e) => handleRangeChange(seg.id, e.target.value)}
                              placeholder={`e.g. 1-3 or 2, 4 (1 to ${selectedFile.pageCount})`}
                              className={`flex-1 px-3 py-1.5 text-xs bg-white border rounded font-mono text-slate-900 focus:outline-hidden ${
                                err ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-red-600'
                              }`}
                            />
                            {rangeSegments.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRange(seg.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                                title="Remove range"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          {err && (
                            <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{err}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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
                onClick={handleSplit}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Split Document
              </button>
            </div>
          </div>
        )}

        <ProcessingCard
          state={processingState}
          onReset={handleReset}
          toolName="split"
        />

        {/* Output list: download individual files or ZIP */}
        {splitOutputs.length > 0 && !processingState.isProcessing && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Extracted Files Ready ({splitOutputs.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Download files individually below, or download the ZIP bundle above
                </p>
              </div>

              {processingState.resultUrl && (
                <a
                  href={processingState.resultUrl}
                  download={processingState.resultFilename || 'split_documents.zip'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Download All as ZIP</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {splitOutputs.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate" title={file.filename}>
                      {file.filename}
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5 font-mono tabular-nums">
                      {formatBytes(file.bytes.byteLength)}
                    </p>
                  </div>
                  <a
                    href={file.url}
                    download={file.filename}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-red-600 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors shadow-2xs"
                    title="Download individual PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdsterraPlacement placementLocation="below-tool" />

      {/* Guide & Rules */}
      <section className="mt-16 space-y-6 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">Page Range Syntax Reference</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <strong className="block text-slate-900 font-semibold mb-1">Continuous Range (Hyphen)</strong>
            <span><code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">1-5</code> extracts pages 1 through 5 inclusively.</span>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <strong className="block text-slate-900 font-semibold mb-1">Specific Pages (Commas)</strong>
            <span><code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">1, 3, 7</code> pulls out only pages 1, 3, and 7.</span>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <strong className="block text-slate-900 font-semibold mb-1">Multiple Outputs (Add Range)</strong>
            <span>Use the "+ Add Another Range" button to create distinct output documents in one batch.</span>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <strong className="block text-slate-900 font-semibold mb-1">Complete Page Splitting</strong>
            <span>Select "Extract Every Page" to automatically generate individual documents for every single page.</span>
          </div>
        </div>
      </section>

      <RelatedTools currentPath="/split-pdf" navigate={navigate} />
    </div>
  );
};
