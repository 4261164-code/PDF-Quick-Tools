import React, { useState } from 'react';
import { Layers, ShieldCheck, HelpCircle } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ReorderableFileList } from '../common/ReorderableFileList';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { FileItem, ProcessingState } from '../../types';
import { getPdfInfo, mergePdfs } from '../../utils/pdfOperations';
import { trackEvent } from '../../utils/analytics';

interface ToolProps {
  navigate: (path: string) => void;
}

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

    trackEvent('processing_started', { tool: 'merge' });

    setProcessingState({
      isProcessing: true,
      progress: 20,
      statusMessage: 'Reading document pages into memory...',
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
        statusMessage: 'Merging document streams and page dictionaries...',
      }));

      const mergedBytes = await mergePdfs(buffers);

      setProcessingState((prev) => ({
        ...prev,
        progress: 90,
        statusMessage: 'Generating final PDF binary...',
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-slate-900">
          Home
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Merge PDF</span>
      </nav>

      {/* Header Title & Intro */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-semibold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Document Combiner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Merge PDF Files Online Free
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Combine two or more PDF documents into a single organized file in seconds. Order your files, review page counts, and download instantly without uploading your files to any third-party server.
        </p>
      </div>

      {/* Main Interactive Workspace */}
      <div className="space-y-6">
        {files.length === 0 && !processingState.resultUrl && (
          <FileDropzone
            acceptType="pdf"
            multiple={true}
            maxFiles={30}
            onFilesSelected={handleFilesSelected}
            title="Drop PDF files to merge here"
            subtitle="Select multiple PDF documents from your computer or phone"
          />
        )}

        {files.length > 0 && !processingState.resultUrl && !processingState.isProcessing && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <ReorderableFileList
              files={files}
              onReorder={setFiles}
              onRemove={handleRemove}
            />

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <FileDropzone
                  acceptType="pdf"
                  multiple={true}
                  maxFiles={10}
                  onFilesSelected={handleFilesSelected}
                  title="Add More PDFs"
                  subtitle="Append more files to the list"
                  className="w-full sm:w-64"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={handleMerge}
                  disabled={files.length < 2}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-40 disabled:pointer-events-none rounded-lg shadow-sm transition-all"
                >
                  Merge {files.length} Files
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Processing and Download Card */}
        <ProcessingCard
          state={processingState}
          onReset={handleReset}
          toolName="merge"
        />
      </div>

      {/* Optional Adsterra Placement */}
      <AdsterraPlacement placementLocation="below-tool" />

      {/* Editorial & Technical Guide Section */}
      <section className="mt-16 space-y-10 text-slate-700">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">How to Merge PDF Files in 3 Simple Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed text-slate-600">
            <li><strong className="text-slate-800">Choose your documents:</strong> Drag and drop your PDFs into the box above or click browse to pick files from your device.</li>
            <li><strong className="text-slate-800">Organize page order:</strong> Use the up and down arrow buttons to arrange your documents in the exact sequence you want them to appear in the combined file.</li>
            <li><strong className="text-slate-800">Click Merge:</strong> Our browser engine compiles your documents in memory and provides an instant direct download link.</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200 text-sm">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Supported Documents & Specifications</h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>• PDF versions 1.0 through 2.0 (ISO 32000 standard).</li>
              <li>• Preserves vector text, hyperlinks, fonts, and embedded images.</li>
              <li>• Up to 30 files per merge session.</li>
              <li>• Maximum recommended file size: 100MB per document for smooth browser performance.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Known Technical Boundaries</h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>• Encrypted or password-locked PDFs must be unlocked before merging.</li>
              <li>• Form fields with conflicting names across documents will be preserved with isolated appearances.</li>
              <li>• Zero server retention: your files are never transmitted across the network.</li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="font-semibold text-sm text-slate-900">Is merging PDFs on this site safe for confidential records?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Yes. Unlike traditional online converters that upload your tax returns, medical records, or legal contracts to an Amazon Web Services or foreign cloud server, PDF Quick Tools processes the binary files entirely inside your device's web browser using client-side JavaScript. No file bits are ever transmitted to our server.
              </p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="font-semibold text-sm text-slate-900">Does merging degrade image quality or compress text?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                No. The merging engine uses lossless structural stream copying. Fonts, high-resolution photographs, and vector lines remain identical byte-for-byte to your original sources.
              </p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="font-semibold text-sm text-slate-900">Can I reorder pages after selecting files?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Yes. Once files are staged in the list, use the up and down arrow controls to adjust the order of documents before merging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Cross Links */}
      <RelatedTools currentPath="/merge-pdf" navigate={navigate} />
    </div>
  );
};
