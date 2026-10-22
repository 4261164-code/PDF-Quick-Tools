import React, { useState } from 'react';
import { RotateCw, RotateCcw, FileText, Check } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { ProcessingState } from '../../types';
import { getPdfInfo, rotatePdfPages } from '../../utils/pdfOperations';
import { parsePageRange } from '../../utils/pageRangeParser';
import { formatBytes } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';

interface ToolProps {
  navigate: (path: string) => void;
}

export const RotateTool: React.FC<ToolProps> = ({ navigate }) => {
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    size: number;
    pageCount: number;
    buffer: ArrayBuffer;
  } | null>(null);

  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [targetScope, setTargetScope] = useState<'all' | 'specific'>('all');
  const [specificPagesInput, setSpecificPagesInput] = useState('');

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
      setSpecificPagesInput('1');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reading PDF file.';
      setProcessingState((prev) => ({ ...prev, error: msg }));
    }
  };

  const handleRotate = async () => {
    if (!selectedFile) return;

    let targetPages: number[] | undefined = undefined;

    if (targetScope === 'specific') {
      const res = parsePageRange(specificPagesInput, selectedFile.pageCount);
      if (!res.valid || res.pages.length === 0) {
        setProcessingState((prev) => ({
          ...prev,
          error: res.error || 'Please provide valid page numbers to rotate.',
        }));
        return;
      }
      targetPages = res.pages;
    }

    trackEvent('processing_started', { tool: 'rotate' });

    setProcessingState({
      isProcessing: true,
      progress: 30,
      statusMessage: `Rotating pages by ${rotationAngle}° clockwise...`,
      error: null,
      resultBlob: null,
      resultUrl: null,
      resultFilename: null,
    });

    try {
      const rotatedBytes = await rotatePdfPages(selectedFile.buffer, rotationAngle, targetPages);

      setProcessingState((prev) => ({
        ...prev,
        progress: 85,
        statusMessage: 'Saving rotated document...',
      }));

      const blob = new Blob([rotatedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename = `${selectedFile.name.replace(/\.pdf$/i, '')}_rotated_${rotationAngle}deg.pdf`;

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

      trackEvent('processing_succeeded', { tool: 'rotate' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to rotate pages.';
      setProcessingState({
        isProcessing: false,
        progress: 0,
        statusMessage: '',
        error: msg,
        resultBlob: null,
        resultUrl: null,
        resultFilename: null,
      });
      trackEvent('processing_failed', { tool: 'rotate' });
    }
  };

  const handleReset = () => {
    if (processingState.resultUrl) {
      URL.revokeObjectURL(processingState.resultUrl);
    }
    setSelectedFile(null);
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
        <span className="text-slate-900 font-medium">Rotate PDF</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-semibold mb-3">
          <RotateCw className="w-3.5 h-3.5" />
          <span>Orientation Fixer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Rotate PDF Pages Online Free
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Permanently fix upside-down scans and landscape pages. Rotate all pages or specific page numbers by 90°, 180°, or 270° clockwise with zero quality degradation.
        </p>
      </div>

      <div className="space-y-6">
        {!selectedFile && !processingState.resultUrl && (
          <FileDropzone
            acceptType="pdf"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            title="Drop the PDF to rotate here"
            subtitle="Upload any PDF with upside-down or sideways pages"
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

            {/* Rotation Degree Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Rotation Angle (Clockwise)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRotationAngle(90)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    rotationAngle === 90
                      ? 'border-red-600 bg-red-50/20 text-slate-900 ring-1 ring-red-600 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <RotateCw className="w-5 h-5 mx-auto mb-1 text-slate-600" />
                  <span className="text-sm">90° Right</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRotationAngle(180)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    rotationAngle === 180
                      ? 'border-red-600 bg-red-50/20 text-slate-900 ring-1 ring-red-600 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <RotateCw className="w-5 h-5 mx-auto mb-1 text-slate-600 rotate-90" />
                  <span className="text-sm">180° Upside Down</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRotationAngle(270)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    rotationAngle === 270
                      ? 'border-red-600 bg-red-50/20 text-slate-900 ring-1 ring-red-600 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <RotateCcw className="w-5 h-5 mx-auto mb-1 text-slate-600" />
                  <span className="text-sm">270° (90° Left)</span>
                </button>
              </div>
            </div>

            {/* Target Scope */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Pages to Rotate
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setTargetScope('all')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    targetScope === 'all'
                      ? 'border-red-600 bg-red-50/20 text-slate-900 ring-1 ring-red-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-semibold">Rotate Entire Document</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">All {selectedFile.pageCount} pages will be rotated</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetScope('specific')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    targetScope === 'specific'
                      ? 'border-red-600 bg-red-50/20 text-slate-900 ring-1 ring-red-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-semibold">Select Specific Pages</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Only rotate certain page numbers or ranges</p>
                </button>
              </div>

              {targetScope === 'specific' && (
                <div>
                  <label htmlFor="rotatePageInput" className="block text-xs font-medium text-slate-700 mb-1">
                    Page Numbers to Rotate (e.g. 1, 3, 5-7)
                  </label>
                  <input
                    id="rotatePageInput"
                    type="text"
                    value={specificPagesInput}
                    onChange={(e) => setSpecificPagesInput(e.target.value)}
                    placeholder="e.g. 1, 3, 5-7"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 font-mono outline-hidden"
                  />
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
                onClick={handleRotate}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Apply Rotation
              </button>
            </div>
          </div>
        )}

        <ProcessingCard
          state={processingState}
          onReset={handleReset}
          toolName="rotate"
        />
      </div>

      <AdsterraPlacement placementLocation="below-tool" />

      {/* Guide */}
      <section className="mt-16 space-y-6 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">How to Permanently Rotate PDF Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed">
            <strong className="block text-slate-900 text-sm mb-1">1. Add PDF</strong>
            Select the document from your files or phone photo scan imports.
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed">
            <strong className="block text-slate-900 text-sm mb-1">2. Choose Angle</strong>
            Select 90 degrees right, 180 degrees upside down, or 270 degrees left.
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed">
            <strong className="block text-slate-900 text-sm mb-1">3. Save Output</strong>
            The rotation tag in the PDF page dictionary is updated directly without re-rasterizing text.
          </div>
        </div>
      </section>

      <RelatedTools currentPath="/rotate-pdf" navigate={navigate} />
    </div>
  );
};
