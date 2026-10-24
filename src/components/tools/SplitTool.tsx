import React, { useState, useEffect } from 'react';
import { Scissors, FileText, Download, Archive, Plus, Trash2, ShieldCheck, HelpCircle, ArrowLeft, AlertCircle, Sparkles, LayoutGrid } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { ProcessingState } from '../../types';
import { getPdfInfo, splitPdfIntoFiles, createZip } from '../../utils/pdfOperations';
import { parsePageRange } from '../../utils/pageRangeParser';
import { formatBytes } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';
import { ToolJsonLd } from '../common/ToolJsonLd';

interface ToolProps {
  navigate: (path: string) => void;
}

interface RangeSegment {
  id: string;
  label: string;
  rangeText: string;
}

const SPLIT_TOOL_FAQS: FaqItem[] = [
  {
    question: 'How do I split a PDF into separate files online?',
    answer: 'Upload your PDF document, choose between custom page ranges (e.g. 1-3, 5, 8-10) or "Extract Every Page", and click Split PDF. The browser extracts the specified pages into distinct documents immediately without uploading your files to any external server.',
  },
  {
    question: 'Can I download all split PDF documents as a single ZIP archive?',
    answer: 'Yes. Once splitting finishes, you can download each extracted document individually or click "Download All as ZIP" to save all created PDF files in a single archive.',
  },
  {
    question: 'Will splitting reduce the quality or remove bookmarks and text formatting?',
    answer: 'No. Splitting uses lossless byte-level structural extraction. Vector text, embedded fonts, and internal hyperlinks are preserved intact.',
  },
  {
    question: 'What page range syntax is supported?',
    answer: 'You can enter continuous page ranges using hyphens (such as 1-5), individual pages separated by commas (such as 1, 4, 9), or create multiple custom output segments.',
  },
];

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

  useEffect(() => {
    return () => {
      if (processingState.resultUrl) {
        URL.revokeObjectURL(processingState.resultUrl);
      }
      splitOutputs.forEach((f) => URL.revokeObjectURL(f.url));
    };
  }, [processingState.resultUrl, splitOutputs]);

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
      statusMessage: 'Extracting sections...',
      error: null,
      resultBlob: null,
      resultUrl: null,
      resultFilename: null,
    });

    try {
      const filesResult = await splitPdfIntoFiles(selectedFile.buffer, selectedFile.name, groups);

      if (processingState.resultUrl) {
        URL.revokeObjectURL(processingState.resultUrl);
      }
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
        statusMessage: 'Bundling ZIP archive...',
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <ToolJsonLd
        name="Split PDF Pages Online - PDF Quick Tools"
        url="https://pdf-quick-tools.vercel.app/split-pdf"
        applicationSubCategory="PDF Splitter"
        description="Split PDF documents by custom page ranges or separate every page into individual files or a ZIP archive. 100% private in-browser processing."
        featureList={[
          "Split PDF by custom page ranges (e.g. 1-3, 5, 8-10)",
          "Extract every page into individual single-page PDF files",
          "Download separated files individually or as a single ZIP archive",
          "Lossless page extraction preserving fonts, vector text, and forms",
          "Zero server uploads: 100% client-side memory processing",
        ]}
      />
      <FaqJsonLd items={SPLIT_TOOL_FAQS} />

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
            <Scissors className="w-3.5 h-3.5" />
            <span>Range Extraction</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]">
            Split PDF <br className="hidden sm:block" />
            <span className="text-brand-primary">Pages Online.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
            Extract specific sections or separate every single page into distinct files. 
            Perfect for isolating contracts, chapters, or invoices with zero data leak risk.
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
                        <span className="tabular-nums">{formatBytes(selectedFile.size)}</span>
                        <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                        <span className="text-brand-primary font-bold">
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

                {/* Split Method */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-text-secondary/70">
                      Extraction Method
                    </h3>
                    {splitMode === 'ranges' && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => applyPreset('halves')}
                          className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60 hover:text-brand-primary transition-colors"
                        >
                          Halves
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPreset('odd')}
                          className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60 hover:text-brand-primary transition-colors"
                        >
                          Odds
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPreset('even')}
                          className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60 hover:text-brand-primary transition-colors"
                        >
                          Evens
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSplitMode('ranges')}
                      className={`group relative p-6 rounded-xl border-2 text-left transition-all ${
                        splitMode === 'ranges'
                          ? 'border-brand-primary bg-brand-primary/[0.02] ring-4 ring-brand-primary/5'
                          : 'border-border-subtle bg-surface-main hover:border-brand-primary/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                        splitMode === 'ranges' ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-secondary/50 group-hover:text-brand-primary'
                      }`}>
                        <FileText className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <p className="text-sm font-bold text-text-primary">Custom Ranges</p>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        Define specific page groups <br /> (e.g. 1-3, 5, 8-10)
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSplitMode('every-page')}
                      className={`group relative p-6 rounded-xl border-2 text-left transition-all ${
                        splitMode === 'every-page'
                          ? 'border-brand-primary bg-brand-primary/[0.02] ring-4 ring-brand-primary/5'
                          : 'border-border-subtle bg-surface-main hover:border-brand-primary/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                        splitMode === 'every-page' ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-secondary/50 group-hover:text-brand-primary'
                      }`}>
                        <LayoutGrid className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <p className="text-sm font-bold text-text-primary">Every Page</p>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        Export all {selectedFile.pageCount} pages as <br /> individual files
                      </p>
                    </button>
                  </div>

                  {/* Range Builder */}
                  {splitMode === 'ranges' && (
                    <div className="space-y-4 pt-6 border-t border-border-subtle/50">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-text-primary/60 uppercase tracking-widest">
                          Output Sections
                        </h4>
                        <button
                          type="button"
                          onClick={addRange}
                          className="flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-hover transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Range</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {rangeSegments.map((seg, idx) => {
                          const err = validationErrors[seg.id];
                          return (
                            <div
                              key={seg.id}
                              className="group relative grid grid-cols-12 gap-3 p-3 bg-surface-bg/50 border border-border-subtle rounded-xl"
                            >
                              <div className="col-span-4">
                                <input
                                  type="text"
                                  value={seg.label}
                                  onChange={(e) => handleLabelChange(seg.id, e.target.value)}
                                  placeholder={`Part ${idx + 1}`}
                                  className="w-full h-12 px-4 text-xs font-bold bg-surface-main border border-border-subtle rounded-lg focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-hidden"
                                />
                              </div>
                              <div className="col-span-7">
                                <input
                                  type="text"
                                  value={seg.rangeText}
                                  onChange={(e) => handleRangeChange(seg.id, e.target.value)}
                                  placeholder={`Pages (e.g. 1-3, 5)`}
                                  className={`w-full h-12 px-4 text-xs font-mono font-bold bg-surface-main border rounded-lg focus:ring-4 transition-all outline-hidden ${
                                    err ? 'border-brand-primary ring-brand-primary/5 text-brand-primary' : 'border-border-subtle focus:border-brand-primary focus:ring-brand-primary/5'
                                  }`}
                                />
                              </div>
                              <div className="col-span-1 flex items-center justify-center">
                                {rangeSegments.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeRange(seg.id)}
                                    className="w-10 h-10 flex items-center justify-center text-text-secondary/30 hover:text-brand-primary transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              {err && (
                                <div className="col-span-12 px-1 flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>{err}</span>
                                </div>
                              )}
                            </div>
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
                    onClick={handleSplit}
                    className="h-12 px-10 text-sm font-black uppercase tracking-widest text-white bg-brand-primary hover:bg-brand-hover rounded-full shadow-lg shadow-brand-primary/25 transition-all active:scale-95"
                  >
                    Split PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          <ProcessingCard
            state={processingState}
            onReset={handleReset}
            toolName="split"
          />

          {splitOutputs.length > 0 && !processingState.isProcessing && (
            <div className="bg-surface-main border border-border-subtle rounded-2xl p-8 shadow-xl shadow-text-primary/5 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border-subtle/50 gap-6">
                <div>
                  <h3 className="text-lg font-black text-text-primary">
                    Split Success
                  </h3>
                  <p className="text-xs text-text-secondary font-medium mt-1 uppercase tracking-wider">
                    {splitOutputs.length} separate files generated
                  </p>
                </div>

                {processingState.resultUrl && (
                  <a
                    href={processingState.resultUrl}
                    download={processingState.resultFilename || 'split_documents.zip'}
                    className="h-12 px-8 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 border border-brand-primary/20 rounded-full transition-all"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Download All (ZIP)</span>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {splitOutputs.map((file, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between gap-4 p-4 bg-surface-bg/50 rounded-xl border border-border-subtle hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate" title={file.filename}>
                        {file.filename}
                      </p>
                      <p className="text-[10px] text-text-secondary/60 mt-1 font-mono uppercase tracking-tighter">
                        {formatBytes(file.bytes.byteLength)}
                      </p>
                    </div>
                    <a
                      href={file.url}
                      download={file.filename}
                      className="w-10 h-10 flex items-center justify-center text-text-secondary/30 hover:text-brand-primary bg-surface-main border border-border-subtle rounded-lg transition-all"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="p-8 bg-surface-main border border-border-subtle rounded-2xl space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">
              Split Reference
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
                  Continuous
                </p>
                <div className="p-3 bg-surface-bg border border-border-subtle rounded-lg">
                  <code className="text-xs font-mono font-bold text-text-primary">1-5</code>
                  <p className="text-[10px] text-text-secondary mt-1 uppercase font-medium">Pages 1 through 5</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
                  Specific
                </p>
                <div className="p-3 bg-surface-bg border border-border-subtle rounded-lg">
                  <code className="text-xs font-mono font-bold text-text-primary">1, 3, 7</code>
                  <p className="text-[10px] text-text-secondary mt-1 uppercase font-medium">Pages 1, 3 and 7</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-tight leading-relaxed">
                  Lossless extraction. Vector data preserved.
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
              <span className="text-brand-primary">Precision Splitting.</span>
            </h2>
            <div className="space-y-4">
              {SPLIT_TOOL_FAQS.slice(0, 2).map((faq, idx) => (
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
              Integrity & <br />
              <span className="text-brand-primary">Compliance.</span>
            </h2>
            <div className="space-y-4">
              {SPLIT_TOOL_FAQS.slice(2).map((faq, idx) => (
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

      <RelatedTools currentPath="/split-pdf" navigate={navigate} />
    </div>
  );
};

