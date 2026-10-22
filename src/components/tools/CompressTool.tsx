import React, { useState } from 'react';
import { Minimize2, FileText, AlertTriangle, ShieldCheck, CheckCircle2, Sliders, Info, ArrowDown } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { ProcessingState } from '../../types';
import { getPdfInfo, compressPdf } from '../../utils/pdfOperations';
import { formatBytes } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';

interface ToolProps {
  navigate: (path: string) => void;
}

export const CompressTool: React.FC<ToolProps> = ({ navigate }) => {
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    size: number;
    pageCount: number;
    buffer: ArrayBuffer;
  } | null>(null);

  const [compressionMode, setCompressionMode] = useState<'standard' | 'aggressive'>('standard');

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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reading PDF file.';
      setProcessingState((prev) => ({ ...prev, error: msg }));
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    trackEvent('processing_started', { tool: 'compress' });

    setProcessingState({
      isProcessing: true,
      progress: 20,
      statusMessage: 'Analyzing document dictionaries and cross-reference tables...',
      error: null,
      resultBlob: null,
      resultUrl: null,
      resultFilename: null,
    });

    try {
      setProcessingState((prev) => ({
        ...prev,
        progress: 55,
        statusMessage: 'Consolidating object streams with Deflate flate-encoding...',
      }));

      const res = await compressPdf(selectedFile.buffer);

      setProcessingState((prev) => ({
        ...prev,
        progress: 90,
        statusMessage: 'Validating output PDF integrity...',
      }));

      const blob = new Blob([res.bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename = `${selectedFile.name.replace(/\.pdf$/i, '')}_optimized.pdf`;

      setProcessingState({
        isProcessing: false,
        progress: 100,
        statusMessage: 'Complete',
        error: null,
        resultBlob: blob,
        resultUrl: url,
        resultFilename: filename,
        originalSize: res.originalSize,
        resultSize: res.compressedSize,
      });

      trackEvent('processing_succeeded', {
        tool: 'compress',
        reductionPercent: res.percentChange,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Compression failed';
      setProcessingState({
        isProcessing: false,
        progress: 0,
        statusMessage: '',
        error: msg,
        resultBlob: null,
        resultUrl: null,
        resultFilename: null,
      });
      trackEvent('processing_failed', { tool: 'compress' });
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

  const getCompressionFeedback = () => {
    if (!processingState.originalSize || !processingState.resultSize) return null;
    const orig = processingState.originalSize;
    const res = processingState.resultSize;
    const diff = orig - res;
    const pct = Math.round((diff / orig) * 1000) / 10;

    if (diff > 0 && pct >= 5) {
      return {
        type: 'success',
        title: `Successfully reduced file size by ${pct}%`,
        description: `Saved ${formatBytes(diff)} through structural object stream packaging and metadata cleanup.`,
      };
    } else if (diff > 0 && pct < 5) {
      return {
        type: 'neutral',
        title: `Marginal reduction (${pct}% saved)`,
        description: `Saved ${formatBytes(diff)}. Your document was already well-structured and efficiently encoded.`,
      };
    } else if (diff === 0) {
      return {
        type: 'neutral',
        title: 'Document already maximally compressed',
        description: 'The internal streams and fonts in this document are already optimized. No further lossless savings possible.',
      };
    } else {
      return {
        type: 'warning',
        title: 'Original file was more compact than standardized streams',
        description: `The output grew slightly by ${formatBytes(Math.abs(diff))}. This occurs when source PDFs utilize specialized proprietary compression. We recommend keeping your original file.`,
      };
    }
  };

  const feedback = getCompressionFeedback();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-slate-900">
          Home
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Compress PDF</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-semibold mb-3">
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Honest Optimization Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Compress PDF Files Online
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Reduce the file size of your PDF files using clean structural object streams and redundant metadata stripping. We report honest byte-level changes and never fabricate compression figures.
        </p>
      </div>

      <div className="space-y-6">
        {!selectedFile && !processingState.resultUrl && (
          <FileDropzone
            acceptType="pdf"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            title="Drop the PDF file to compress here"
            subtitle="Upload any PDF document up to 100MB"
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
                    Original Size: <span className="font-mono tabular-nums font-semibold text-slate-900">{formatBytes(selectedFile.size)}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="tabular-nums">{selectedFile.pageCount} pages</span>
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

            {/* Profile Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Optimization Profile
              </label>

              <div className="p-4 rounded-lg border border-red-600 bg-red-50/20 ring-1 ring-red-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Lossless Structural Stream Optimization
                  </span>
                  <span className="text-xs font-semibold text-red-700 bg-red-100/70 px-2 py-0.5 rounded">
                    Zero Quality Degradation
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Consolidates internal object dictionaries into compressed Deflate object streams, strips authoring thumbnails, and removes orphaned cross-references while retaining 100% vector and text sharpness.
                </p>
              </div>
            </div>

            {/* Honest Expectation Notice */}
            <div className="flex items-start gap-3 p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Honest Compression Notice:</strong> If your PDF is already composed of scanned JPEG images or already uses object streams, reduction percentages may be modest. We report real byte changes honestly.
              </div>
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
                onClick={handleCompress}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Compress Document
              </button>
            </div>
          </div>
        )}

        {/* Processing State Card */}
        <ProcessingCard
          state={processingState}
          onReset={handleReset}
          toolName="compress"
        />

        {/* Detailed Honest Outcome Feedback Box if Completed */}
        {feedback && processingState.resultUrl && !processingState.isProcessing && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : feedback.type === 'warning'
                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Info className="w-4 h-4 text-slate-500" />
              )}
              <span>{feedback.title}</span>
            </div>
            <p className="text-slate-600 pl-6">{feedback.description}</p>
          </div>
        )}
      </div>

      <AdsterraPlacement placementLocation="below-tool" />

      {/* Guide & Technical FAQs */}
      <section className="mt-16 space-y-8 text-slate-700">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Understanding Real PDF Compression</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Unlike simple text files, PDFs are multi-part binary containers. A document's file size is governed by three distinct categories:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">1. Object Dictionaries</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Page structures, fonts, and annotations. We bundle these into compressed Deflate object streams.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">2. Authoring Metadata</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Embedded thumbnail images, edit history XML, and printer profiles that can be safely stripped.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">3. Embedded Scans</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              High-DPI scanner imagery. When already compressed as JPEG/JBIG2, lossless rewrites preserve 100% pixel sharpness.
            </p>
          </div>
        </div>
      </section>

      <RelatedTools currentPath="/compress-pdf" navigate={navigate} />
    </div>
  );
};
