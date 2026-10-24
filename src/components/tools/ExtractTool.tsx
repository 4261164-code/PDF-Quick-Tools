import React, { useState, useEffect } from 'react';
import { FileOutput, FileText, Check, ArrowLeft, ShieldCheck, HelpCircle, Hash, Pointer, ClipboardList } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { ProcessingState } from '../../types';
import { getPdfInfo, extractPdfPages } from '../../utils/pdfOperations';
import { parsePageRange } from '../../utils/pageRangeParser';
import { formatBytes } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';
import { ToolJsonLd } from '../common/ToolJsonLd';

interface ToolProps {
  navigate: (path: string) => void;
}

const EXTRACT_TOOL_FAQS: FaqItem[] = [
  {
    question: 'How do I extract specific pages from a PDF document?',
    answer: 'Upload your PDF file, enter the desired page numbers or ranges (e.g. 1-3, 5, 8-10) or click the numbered buttons, and click Extract Pages. A new PDF containing exclusively those pages will be compiled and downloaded.',
  },
  {
    question: 'What happens to the remaining pages of the original PDF?',
    answer: 'Your original file remains completely untouched on your device. The tool generates a brand-new PDF containing only your selected pages.',
  },
  {
    question: 'Can I extract non-consecutive pages?',
    answer: 'Yes. You can specify any combination of individual pages and discontinuous ranges using comma notation, such as 2, 7, 12-15.',
  },
  {
    question: 'Does extracting pages preserve text layers?',
    answer: 'Yes. Extraction uses direct page dictionary referencing. All selectable text, embedded fonts, vector artwork, and form fields on the extracted pages remain intact.',
  },
];

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

    if (processingState.resultUrl) {
      URL.revokeObjectURL(processingState.resultUrl);
    }

    trackEvent('processing_started', { tool: 'extract' });

    setProcessingState({
      isProcessing: true,
      progress: 30,
      statusMessage: 'Extracting pages...',
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
        statusMessage: 'Generating document...',
      }));

      const blob = new Blob([extractedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename = `${selectedFile.name.replace(/\.pdf$/i, '')}_extracted.pdf`;

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <ToolJsonLd
        name="Extract PDF Pages Online - PDF Quick Tools"
        url="https://pdf-quick-tools.vercel.app/extract-pdf-pages"
        applicationSubCategory="PDF Page Extractor"
        description="Extract specific page numbers or chapters from any PDF without losing vector formatting or quality. 100% private in-browser processing."
        featureList={[
          "Select specific pages using visual interactive selector chips",
          "Specify complex page ranges with comma and hyphen formulas (e.g. 1-3, 5, 8-10)",
          "Lossless page dictionary referencing preserving forms, text, and vector graphics",
          "Zero quality loss: untouched original files with standalone extracted document",
          "Zero server uploads: 100% client-side memory privacy",
        ]}
      />
      <FaqJsonLd items={EXTRACT_TOOL_FAQS} />

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
            <FileOutput className="w-3.5 h-3.5" />
            <span>Selective Extraction</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]">
            Extract PDF <br className="hidden sm:block" />
            <span className="text-brand-primary">Pages Online.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
            Pull specific pages, chapters, or sheets into a new document. 
            Select visually or define complex ranges with zero quality loss.
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

                <div className="space-y-10">
                  {/* Range Input */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/70">
                      <Hash className="w-3 h-3 text-brand-primary" />
                      Page Range Formula
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={pageInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="e.g. 1-3, 5, 8-10"
                        className="w-full h-14 px-6 text-sm font-mono font-bold bg-surface-bg border-2 border-border-subtle rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-hidden"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary/20">
                        <ClipboardList className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-brand-primary/[0.03] border border-brand-primary/10 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <p className="text-xs font-bold text-text-primary">
                        Selection: <span className="text-brand-primary tabular-nums">{selectedPages.length}</span> {selectedPages.length === 1 ? 'page' : 'pages'}
                      </p>
                    </div>
                  </div>

                  {/* Visual Grid Selector */}
                  {selectedFile.pageCount <= 60 && (
                    <div className="space-y-4 pt-10 border-t border-border-subtle/50">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/70">
                        <Pointer className="w-3 h-3 text-brand-primary" />
                        Interactive Selection
                      </label>
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                        {Array.from({ length: selectedFile.pageCount }, (_, i) => i + 1).map((num) => {
                          const isSelected = selectedPages.includes(num);
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => togglePage(num)}
                              className={`h-12 w-full rounded-lg border-2 font-mono text-xs font-black flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20 scale-105'
                                  : 'bg-surface-bg text-text-secondary/60 border-border-subtle hover:border-brand-primary/40 hover:text-text-primary'
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
                    onClick={handleExtract}
                    disabled={selectedPages.length === 0}
                    className="h-12 px-10 text-sm font-black uppercase tracking-widest text-white bg-brand-primary hover:bg-brand-hover disabled:opacity-30 disabled:pointer-events-none rounded-full shadow-lg shadow-brand-primary/25 transition-all active:scale-95"
                  >
                    Extract Pages
                  </button>
                </div>
              </div>
            </div>
          )}

          <ProcessingCard
            state={processingState}
            onReset={handleReset}
            toolName="extract"
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="p-8 bg-surface-main border border-border-subtle rounded-2xl space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">
              Extraction Rules
            </h3>
            <div className="space-y-6">
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  Safe Splitting
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Your original file remains untouched. We create a completely new document with your pages.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  Full Integrity
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Selectable text layers, forms, and vector graphics are preserved with 100% accuracy.
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-tight leading-relaxed">
                  Local Memory Processing. <br /> Zero Uploads.
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
              The Architecture of <br />
              <span className="text-brand-primary">Document Isolation.</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">01</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Stage Source</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Upload any PDF. Our engine reads the page dictionary structure immediately in your browser.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">02</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Select Portions</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Click the interactive numbered cards or type a complex range. Selection is instant.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">03</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Extract Binary</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    The engine isolates the specific object streams and generates your new file.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight text-text-primary">
              Common <br />
              <span className="text-brand-primary">Questions.</span>
            </h2>
            <div className="space-y-4">
              {EXTRACT_TOOL_FAQS.map((faq, idx) => (
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

      <RelatedTools currentPath="/extract-pdf-pages" navigate={navigate} />
    </div>
  );
};

