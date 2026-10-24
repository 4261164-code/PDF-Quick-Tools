import React, { useState, useEffect } from 'react';
import { Minimize2, FileText, AlertTriangle, ShieldCheck, HelpCircle, ArrowLeft, Info, CheckCircle2, Sliders, Zap } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { ProcessingState } from '../../types';
import { getPdfInfo, compressPdf } from '../../utils/pdfOperations';
import { formatBytes } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';
import { ToolJsonLd } from '../common/ToolJsonLd';

interface ToolProps {
  navigate: (path: string) => void;
}

const COMPRESS_TOOL_FAQS: FaqItem[] = [
  {
    question: 'How does in-browser PDF compression work without uploading files?',
    answer: 'Our engine performs Deflate object stream compression, strips redundant document metadata, and optimizes internal cross-reference tables directly in your browser memory via WebAssembly and JavaScript. Your files never leave your device.',
  },
  {
    question: 'Why do some PDF files barely shrink or remain the same size?',
    answer: 'If your PDF consists primarily of pre-compressed JPEG images or was already optimized by professional software, further lossless reduction is physically limited. Our tool provides honest byte metrics so you always know the exact result.',
  },
  {
    question: 'Will compressing my PDF blur the text or degrade print quality?',
    answer: 'No. Our standard compression is completely lossless for vector text, line artwork, and embedded fonts. Text remains crisp at any zoom level, and digital signatures are preserved.',
  },
  {
    question: 'Is there a limit on the PDF file size I can compress?',
    answer: 'You can compress PDF files up to 100MB directly in your browser. Because processing runs on your local CPU and RAM, there are no cloud queue delays or timeouts.',
  },
];

export const CompressTool: React.FC<ToolProps> = ({ navigate }) => {
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    size: number;
    pageCount: number;
    buffer: ArrayBuffer;
  } | null>(null);

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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reading PDF file.';
      setProcessingState((prev) => ({ ...prev, error: msg }));
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    if (processingState.resultUrl) {
      URL.revokeObjectURL(processingState.resultUrl);
    }

    trackEvent('processing_started', { tool: 'compress' });

    setProcessingState({
      isProcessing: true,
      progress: 20,
      statusMessage: 'Analyzing document dictionaries...',
      error: null,
      resultBlob: null,
      resultUrl: null,
      resultFilename: null,
    });

    try {
      setProcessingState((prev) => ({
        ...prev,
        progress: 55,
        statusMessage: 'Optimizing object streams...',
      }));

      const res = await compressPdf(selectedFile.buffer);

      setProcessingState((prev) => ({
        ...prev,
        progress: 90,
        statusMessage: 'Finalizing PDF integrity...',
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
        title: `Reduced file size by ${pct}%`,
        description: `Successfully saved ${formatBytes(diff)} through structural stream packaging.`,
      };
    } else if (diff > 0 && pct < 5) {
      return {
        type: 'neutral',
        title: `Optimized (${pct}% saved)`,
        description: `Saved ${formatBytes(diff)}. Your document was already highly efficient.`,
      };
    } else if (diff === 0) {
      return {
        type: 'neutral',
        title: 'Already Maximally Compressed',
        description: 'The internal streams in this document are already optimized. No further lossless savings possible.',
      };
    } else {
      return {
        type: 'warning',
        title: 'Original file was more compact',
        description: `The standardized output grew by ${formatBytes(Math.abs(diff))}. We recommend using your original file.`,
      };
    }
  };

  const feedback = getCompressionFeedback();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <ToolJsonLd
        name="Compress PDF Files Online - PDF Quick Tools"
        url="https://pdf-quick-tools.vercel.app/compress-pdf"
        applicationSubCategory="PDF Optimizer"
        description="Reduce PDF file sizes using browser-based Deflate object stream optimization with honest byte reporting and zero text blurring."
        featureList={[
          "Lossless structural object stream optimization using Deflate algorithm",
          "Authoring metadata cleanup and redundant thumbnail removal",
          "Honest byte-level savings tracking without fabricated numbers",
          "Zero quality loss: keeps 100% vector typography and lines crisp",
          "Zero server uploads: 100% client-side memory privacy",
        ]}
      />
      <FaqJsonLd items={COMPRESS_TOOL_FAQS} />

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
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Optimization Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]">
            Compress PDF <br className="hidden sm:block" />
            <span className="text-brand-primary">Files Fast.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
            Reduce file weight for email, portals, and archives. We use safe, structural 
            optimization that preserves 100% of your text and vector clarity.
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
                <div className="flex items-center justify-between p-5 bg-surface-bg border border-border-subtle rounded-xl mb-8">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">{selectedFile.name}</p>
                      <div className="flex items-center gap-3 text-[11px] font-mono font-medium text-text-secondary/60 mt-1 uppercase">
                        <span className="tabular-nums font-bold text-text-primary">{formatBytes(selectedFile.size)}</span>
                        <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                        <span className="tabular-nums">
                          {selectedFile.pageCount} Pages
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

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-text-secondary/70">
                      Standard Optimization Profile
                    </h3>
                    <div className="group relative p-6 rounded-xl border-2 border-brand-primary bg-brand-primary/[0.02] ring-4 ring-brand-primary/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center">
                            <Zap className="w-5 h-5 stroke-[1.5]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-primary">Lossless Deflate Engine</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mt-0.5">High Efficiency</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Consolidates internal object dictionaries into compressed flate streams, strips redundant metadata, and removes orphaned references. 100% vector and text sharpness guaranteed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-amber-50/50 border border-amber-100 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">Honest Reporting</p>
                      <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                        If your PDF is already composed of scanned images, further savings may be modest. 
                        We report real byte changes honestly, never inflating percentages.
                      </p>
                    </div>
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
                    onClick={handleCompress}
                    className="h-12 px-10 text-sm font-black uppercase tracking-widest text-white bg-brand-primary hover:bg-brand-hover rounded-full shadow-lg shadow-brand-primary/25 transition-all active:scale-95"
                  >
                    Compress File
                  </button>
                </div>
              </div>
            </div>
          )}

          <ProcessingCard
            state={processingState}
            onReset={handleReset}
            toolName="compress"
          />

          {feedback && processingState.resultUrl && !processingState.isProcessing && (
            <div className={`p-8 rounded-2xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
              feedback.type === 'success'
                ? 'bg-emerald-50/30 border-emerald-100 text-emerald-900'
                : feedback.type === 'warning'
                ? 'bg-amber-50/30 border-amber-100 text-amber-900'
                : 'bg-surface-main border-border-subtle text-text-primary shadow-lg shadow-text-primary/5'
            }`}>
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  feedback.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-surface-bg text-text-secondary/50'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <h3 className="text-lg font-black">{feedback.title}</h3>
              </div>
              <p className="text-sm text-text-secondary/80 leading-relaxed font-medium pl-14">
                {feedback.description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="p-8 bg-surface-main border border-border-subtle rounded-2xl space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">
              The Engine
            </h3>
            <div className="space-y-6">
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  Dictionary Optimization
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Structural objects and fonts are bundled into flate streams for minimal footprint.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  Metadata Stripping
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Safely removes redundant thumbnails, history XML, and unused cross-references.
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-tight leading-relaxed">
                  100% Private. <br /> In-Browser Processing.
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
              Scientific <br />
              <span className="text-brand-primary">Weight Reduction.</span>
            </h2>
            <div className="space-y-4">
              {COMPRESS_TOOL_FAQS.slice(0, 2).map((faq, idx) => (
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

          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight text-text-primary">
              Quality & <br />
              <span className="text-brand-primary">Integrity.</span>
            </h2>
            <div className="space-y-4">
              {COMPRESS_TOOL_FAQS.slice(2).map((faq, idx) => (
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

      <RelatedTools currentPath="/compress-pdf" navigate={navigate} />
    </div>
  );
};

