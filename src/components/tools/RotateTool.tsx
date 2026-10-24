import React, { useState, useEffect } from 'react';
import { RotateCw, RotateCcw, FileText, ArrowLeft, ShieldCheck, HelpCircle, Compass, RefreshCw } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { ProcessingState } from '../../types';
import { getPdfInfo, rotatePdfPages } from '../../utils/pdfOperations';
import { parsePageRange } from '../../utils/pageRangeParser';
import { formatBytes } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';
import { ToolJsonLd } from '../common/ToolJsonLd';

interface ToolProps {
  navigate: (path: string) => void;
}

const ROTATE_TOOL_FAQS: FaqItem[] = [
  {
    question: 'Is the rotation permanent or just a preview?',
    answer: 'The rotation is permanent. Our tool updates the official /Rotate attribute in the PDF document dictionary so the new orientation displays correctly in all PDF viewers.',
  },
  {
    question: 'Can I rotate only specific pages?',
    answer: 'Yes. You can choose "Specific Pages" and enter specific page numbers or ranges (e.g. 1, 3, 5-7) to rotate only the pages that are sideways.',
  },
  {
    question: 'Does rotating a PDF degrade font quality?',
    answer: 'No. Rotating modifies orientation metadata coordinates without re-rasterizing text or images. Quality remains 100% identical.',
  },
  {
    question: 'What rotation angles are supported?',
    answer: 'You can rotate pages 90° clockwise (right), 180° (upside down), or 270° clockwise (left / 90° counter-clockwise).',
  },
];

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

  useEffect(() => {
    return () => {
      if (processingState.resultUrl) {
        URL.revokeObjectURL(processingState.resultUrl);
      }
    };
  }, [processingState.resultUrl]);

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

    if (processingState.resultUrl) {
      URL.revokeObjectURL(processingState.resultUrl);
    }

    trackEvent('processing_started', { tool: 'rotate' });

    setProcessingState({
      isProcessing: true,
      progress: 30,
      statusMessage: 'Adjusting orientation...',
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
        statusMessage: 'Saving document...',
      }));

      const blob = new Blob([rotatedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename = `${selectedFile.name.replace(/\.pdf$/i, '')}_rotated.pdf`;

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <ToolJsonLd
        name="Rotate PDF Pages Online - PDF Quick Tools"
        url="https://pdf-quick-tools.vercel.app/rotate-pdf"
        applicationSubCategory="PDF Page Rotator"
        description="Permanently rotate upside-down or sideways PDF pages by 90, 180, or 270 degrees clockwise. 100% private in-browser processing."
        featureList={[
          "Rotate all pages or specific page numbers/ranges",
          "Permanent rotation catalog dictionary updates without text rasterization",
          "Supports 90 degrees right, 180 degrees flip, and 270 degrees left",
          "Zero quality degradation: preserves vector text and font definitions",
          "Zero server uploads: 100% client-side memory privacy",
        ]}
      />
      <FaqJsonLd items={ROTATE_TOOL_FAQS} />

      {/* Navigation & Header */}
      <div className="flex flex-col items-start gap-8 mb-16">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary/60 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Tools</span>
        </button>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Orientation Fixer</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]">
            Rotate PDF <br className="hidden sm:block" />
            <span className="text-brand-primary">Pages Permanently.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
            Fix sideways scans or upside-down uploads in seconds. We update the document's
            internal rotation flags while keeping 100% of your original quality.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-8">
          {!selectedFile && !processingState.resultUrl && (
            <FileDropzone
              acceptType="pdf"
              multiple={false}
              onFilesSelected={handleFilesSelected}
            />
          )}

          {selectedFile && !processingState.resultUrl && !processingState.isProcessing && (
            <div className="space-y-8">
              <div className="bg-surface-main border border-border-subtle rounded-2xl p-8 shadow-xl shadow-text-primary/5">
                {/* File Header */}
                <div className="flex items-center justify-between p-5 bg-surface-bg border border-border-subtle rounded-xl mb-10">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">{selectedFile.name}</p>
                      <div className="flex items-center gap-3 text-[11px] font-mono font-medium text-text-secondary/60 mt-1 uppercase">
                        <span className="tabular-nums font-bold text-text-primary">{formatBytes(selectedFile.size)}</span>
                        <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                        <span className="text-brand-primary font-bold">
                          {selectedFile.pageCount} Pages Total
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="h-10 px-4 text-xs font-bold uppercase tracking-widest text-text-secondary/60 hover:text-brand-primary transition-colors"
                  >
                    Change
                  </button>
                </div>

                <div className="space-y-12">
                  {/* Angle Selection */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/70">
                      <Compass className="w-3 h-3 text-brand-primary" />
                      Rotation Angle
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setRotationAngle(90)}
                        className={`group relative h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                          rotationAngle === 90
                            ? 'border-brand-primary bg-brand-primary/[0.02] ring-4 ring-brand-primary/5'
                            : 'border-border-subtle bg-surface-main hover:border-brand-primary/30'
                        }`}
                      >
                        <RotateCw className={`w-6 h-6 transition-colors ${rotationAngle === 90 ? 'text-brand-primary' : 'text-text-secondary/40 group-hover:text-brand-primary/60'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${rotationAngle === 90 ? 'text-brand-primary' : 'text-text-secondary/60'}`}>90° Right</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRotationAngle(180)}
                        className={`group relative h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                          rotationAngle === 180
                            ? 'border-brand-primary bg-brand-primary/[0.02] ring-4 ring-brand-primary/5'
                            : 'border-border-subtle bg-surface-main hover:border-brand-primary/30'
                        }`}
                      >
                        <RotateCw className={`w-6 h-6 rotate-90 transition-colors ${rotationAngle === 180 ? 'text-brand-primary' : 'text-text-secondary/40 group-hover:text-brand-primary/60'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${rotationAngle === 180 ? 'text-brand-primary' : 'text-text-secondary/60'}`}>180° Flip</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRotationAngle(270)}
                        className={`group relative h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                          rotationAngle === 270
                            ? 'border-brand-primary bg-brand-primary/[0.02] ring-4 ring-brand-primary/5'
                            : 'border-border-subtle bg-surface-main hover:border-brand-primary/30'
                        }`}
                      >
                        <RotateCcw className={`w-6 h-6 transition-colors ${rotationAngle === 270 ? 'text-brand-primary' : 'text-text-secondary/40 group-hover:text-brand-primary/60'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${rotationAngle === 270 ? 'text-brand-primary' : 'text-text-secondary/60'}`}>90° Left</span>
                      </button>
                    </div>
                  </div>

                  {/* Selection Scope */}
                  <div className="space-y-4 pt-10 border-t border-border-subtle/50">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/70">
                      Selection Scope
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setTargetScope('all')}
                        className={`p-5 rounded-xl border-2 text-left transition-all ${
                          targetScope === 'all'
                            ? 'border-brand-primary bg-brand-primary/[0.02] ring-4 ring-brand-primary/5'
                            : 'border-border-subtle bg-surface-main hover:border-brand-primary/30'
                        }`}
                      >
                        <p className="text-sm font-bold text-text-primary">All Pages</p>
                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">Rotate the entire document</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTargetScope('specific')}
                        className={`p-5 rounded-xl border-2 text-left transition-all ${
                          targetScope === 'specific'
                            ? 'border-brand-primary bg-brand-primary/[0.02] ring-4 ring-brand-primary/5'
                            : 'border-border-subtle bg-surface-main hover:border-brand-primary/30'
                        }`}
                      >
                        <p className="text-sm font-bold text-text-primary">Specific Pages</p>
                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">Only rotate targeted page numbers</p>
                      </button>
                    </div>

                    {targetScope === 'specific' && (
                      <div className="pt-4 animate-in fade-in slide-in-from-top-2">
                        <input
                          type="text"
                          value={specificPagesInput}
                          onChange={(e) => setSpecificPagesInput(e.target.value)}
                          placeholder="e.g. 1, 3, 5-7"
                          className="w-full h-12 px-6 text-sm font-mono font-bold bg-surface-bg border-2 border-border-subtle rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border-subtle flex items-center justify-end gap-6">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="h-12 px-10 text-sm font-black uppercase tracking-widest text-white bg-brand-primary hover:bg-brand-hover rounded-full shadow-lg shadow-brand-primary/25 transition-all active:scale-95"
                  >
                    Apply Rotation
                  </button>
                </div>
              </div>
            </div>
          )}

          <ProcessingCard
            state={processingState}
            onReset={handleReset}
            toolName="rotate"
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="p-8 bg-surface-main border border-border-subtle rounded-2xl space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">
              Rotation Standard
            </h3>
            <div className="space-y-6">
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  Official Attribute
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  We update the /Rotate attribute in the PDF dictionary for universal compatibility.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  Zero Re-Encoding
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Fonts and images are not altered. The file structure is updated losslessly.
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-tight leading-relaxed">
                  Private Memory Rotation. <br /> Zero Uploads.
                </p>
              </div>
            </div>
          </div>
          <AdsterraPlacement placementLocation="below-tool" />
        </div>
      </div>

      {/* Guide Section */}
      <div className="mt-32 pt-20 border-t border-border-subtle">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight text-text-primary">
              Precision <br />
              <span className="text-brand-primary">Orientation.</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">01</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Load Document</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Import your PDF. Sideways scans are identifying by their orientation flags instantly.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">02</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Choose Direction</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Select the exact angle needed to fix the orientation. All metadata is updated safely.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">03</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Download File</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Get your document back with fixed rotation that works across all devices and apps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight text-text-primary">
              Technical <br />
              <span className="text-brand-primary">FAQs.</span>
            </h2>
            <div className="space-y-4">
              {ROTATE_TOOL_FAQS.map((faq, idx) => (
                <div key={idx} className="group p-6 bg-surface-main border border-border-subtle rounded-2xl hover:border-brand-primary/30 transition-colors">
                  <h3 className="font-bold text-text-primary flex items-center justify-between">
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RelatedTools currentPath="/rotate-pdf" navigate={navigate} />
    </div>
  );
};

