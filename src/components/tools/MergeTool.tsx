import React, { useState, useEffect } from 'react';
import { Layers, ShieldCheck, HelpCircle, ArrowLeft, Plus } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ReorderableFileList } from '../common/ReorderableFileList';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { FileItem, ProcessingState } from '../../types';
import { getPdfInfo, mergePdfs } from '../../utils/pdfOperations';
import { trackEvent } from '../../utils/analytics';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';
import { ToolJsonLd } from '../common/ToolJsonLd';

interface ToolProps {
  navigate: (path: string) => void;
}

const MERGE_TOOL_FAQS: FaqItem[] = [
  {
    question: 'Is merging PDFs on this site safe for confidential records?',
    answer: "Yes. Unlike traditional online converters that upload your tax returns, medical records, or legal contracts to third-party cloud servers, PDF Quick Tools processes all binary files entirely inside your web browser using client-side WebAssembly and JavaScript. No file bits are ever transmitted over the network.",
  },
  {
    question: 'Does merging degrade image quality or compress text?',
    answer: 'No. The merging engine uses lossless structural stream copying. Fonts, high-resolution photographs, and vector lines remain identical byte-for-byte to your original sources.',
  },
  {
    question: 'Can I reorder pages or documents before merging?',
    answer: 'Yes. Once files are staged in the list, use drag-and-drop or the keyboard-accessible up and down arrow controls to adjust the exact sequence before generating your merged PDF.',
  },
  {
    question: 'What is the maximum number of PDF files I can merge at once?',
    answer: 'You can merge up to 30 PDF documents in a single operation, with individual document sizes up to 100MB supported smoothly in memory.',
  },
];

export const MergeTool: React.FC<ToolProps> = ({ navigate }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
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

  const handleFilesSelected = async (newFiles: File[]) => {
    const items: FileItem[] = [];

    for (const file of newFiles) {
      try {
        const buffer = await file.arrayBuffer();
        const info = await getPdfInfo(buffer);
        items.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          name: file.name,
          size: file.size,
          pageCount: info.pageCount,
          arrayBuffer: buffer,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error reading PDF';
        setProcessingState((prev) => ({
          ...prev,
          error: `Could not load "${file.name}": ${msg}`,
        }));
        return;
      }
    }

    setFiles((prev) => [...prev, ...items]);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setProcessingState((prev) => ({
        ...prev,
        error: 'Please add at least two PDF files to merge.',
      }));
      return;
    }

    if (processingState.resultUrl) {
      URL.revokeObjectURL(processingState.resultUrl);
    }

    trackEvent('processing_started', { tool: 'merge' });

    setProcessingState({
      isProcessing: true,
      progress: 20,
      statusMessage: 'Reading documents...',
      error: null,
      resultBlob: null,
      resultUrl: null,
      resultFilename: null,
    });

    try {
      const buffers = files.map((f) => f.arrayBuffer!);

      setProcessingState((prev) => ({
        ...prev,
        progress: 60,
        statusMessage: 'Compiling PDF streams...',
      }));

      const mergedBytes = await mergePdfs(buffers);

      setProcessingState((prev) => ({
        ...prev,
        progress: 90,
        statusMessage: 'Finalizing binary...',
      }));

      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename = `merged_document_${Date.now()}.pdf`;

      const totalOriginalSize = files.reduce((acc, curr) => acc + curr.size, 0);

      setProcessingState({
        isProcessing: false,
        progress: 100,
        statusMessage: 'Complete',
        error: null,
        resultBlob: blob,
        resultUrl: url,
        resultFilename: filename,
        originalSize: totalOriginalSize,
        resultSize: blob.size,
      });

      trackEvent('processing_succeeded', { tool: 'merge' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to merge documents';
      setProcessingState({
        isProcessing: false,
        progress: 0,
        statusMessage: '',
        error: msg,
        resultBlob: null,
        resultUrl: null,
        resultFilename: null,
      });
      trackEvent('processing_failed', { tool: 'merge' });
    }
  };

  const handleReset = () => {
    if (processingState.resultUrl) {
      URL.revokeObjectURL(processingState.resultUrl);
    }
    setFiles([]);
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <ToolJsonLd
        name="Merge PDF Files Online - PDF Quick Tools"
        url="https://pdf-quick-tools.vercel.app/merge-pdf"
        applicationSubCategory="PDF Merger"
        description="Combine multiple PDF files into one clean document with drag-and-drop reordering. 100% private in-browser processing with zero server uploads."
        featureList={[
          "Client-side merging of up to 30 PDF documents",
          "Accessible drag-and-drop reordering with keyboard controls",
          "Lossless structural stream copying preserving fonts and vector text",
          "Zero server uploads: 100% client-side memory privacy",
          "Supports PDF versions 1.0 through 2.0",
        ]}
      />
      <FaqJsonLd items={MERGE_TOOL_FAQS} />

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
            <Layers className="w-3.5 h-3.5" />
            <span>Document Combiner</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]">
            Merge PDF <br className="hidden sm:block" />
            <span className="text-brand-primary">Files Online.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
            Combine multiple PDF documents into a single, professional file in seconds. 
            All processing happens locally in your browser—your data never leaves your device.
          </p>
        </div>
      </div>

      {/* Main Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-8">
          {files.length === 0 && !processingState.resultUrl && (
            <FileDropzone
              acceptType="pdf"
              multiple={true}
              maxFiles={30}
              onFilesSelected={handleFilesSelected}
            />
          )}

          {files.length > 0 && !processingState.resultUrl && !processingState.isProcessing && (
            <div className="space-y-8">
              <div className="bg-surface-main border border-border-subtle rounded-2xl p-8 shadow-xl shadow-text-primary/5">
                <ReorderableFileList
                  files={files}
                  onReorder={setFiles}
                  onRemove={handleRemove}
                />

                <div className="mt-8 pt-8 border-t border-border-subtle/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.multiple = true;
                      input.accept = '.pdf,application/pdf';
                      input.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.files) handleFilesSelected(Array.from(target.files));
                      };
                      input.click();
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-hover transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add more files</span>
                  </button>

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 sm:flex-none h-12 px-6 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
                    >
                      Clear Queue
                    </button>
                    <button
                      type="button"
                      onClick={handleMerge}
                      disabled={files.length < 2}
                      className="flex-1 sm:flex-none h-12 px-10 text-sm font-black uppercase tracking-widest text-white bg-brand-primary hover:bg-brand-hover disabled:opacity-30 disabled:pointer-events-none rounded-full shadow-lg shadow-brand-primary/25 transition-all active:scale-95"
                    >
                      Merge Files
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ProcessingCard
            state={processingState}
            onReset={handleReset}
            toolName="merge"
          />
        </div>

        {/* Sidebar / Info */}
        <div className="lg:col-span-4 space-y-10">
          <div className="p-8 bg-surface-main border border-border-subtle rounded-2xl space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">
              Private & Local
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">No Uploads</p>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Files are processed using client-side WebAssembly. Nothing is ever sent to our servers.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Lossless Quality</p>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Your document's fonts, vectors, and image clarity are preserved with byte-for-byte accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-2">
            <AdsterraPlacement placementLocation="below-tool" />
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <div className="mt-32 pt-20 border-t border-border-subtle">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight text-text-primary">
              The Professional <br />
              <span className="text-brand-primary">Merging Standard.</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">01</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Load Documents</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Select up to 30 PDF files. Our engine scans them instantly in-memory to verify integrity.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">02</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Sequence Order</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Arrange files in your preferred order using our intuitive reorder system.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">03</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Generate & Save</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Click merge and receive your single, compiled document instantly.
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
              {MERGE_TOOL_FAQS.map((faq, idx) => (
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

      <RelatedTools currentPath="/merge-pdf" navigate={navigate} />
    </div>
  );
};
