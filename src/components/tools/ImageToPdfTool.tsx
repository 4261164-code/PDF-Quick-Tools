import React, { useState } from 'react';
import { Image as ImageIcon, Sliders, ArrowRight } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ReorderableFileList } from '../common/ReorderableFileList';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { FileItem, ProcessingState, ImageToPdfOptions } from '../../types';
import { imagesToPdf } from '../../utils/pdfOperations';
import { validateImageSignature } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';

interface ToolProps {
  navigate: (path: string) => void;
}

export const ImageToPdfTool: React.FC<ToolProps> = ({ navigate }) => {
  const [images, setImages] = useState<FileItem[]>([]);
  const [options, setOptions] = useState<ImageToPdfOptions>({
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 18,
  });

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
      const type = await validateImageSignature(file);
      const ext = file.name.split('.').pop()?.toLowerCase();
      const resolvedType = type || (ext === 'png' ? 'png' : 'jpeg');

      const buffer = await file.arrayBuffer();

      items.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        arrayBuffer: buffer,
      });
    }

    setImages((prev) => [...prev, ...items]);
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    trackEvent('processing_started', { tool: 'image-to-pdf' });

    setProcessingState({
      isProcessing: true,
      progress: 20,
      statusMessage: 'Reading images and configuring target canvas...',
      error: null,
      resultBlob: null,
      resultUrl: null,
      resultFilename: null,
    });

    try {
      const imagePayloads: { buffer: ArrayBuffer; type: 'jpeg' | 'png' | 'webp' }[] = [];

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        let formatType: 'jpeg' | 'png' = 'jpeg';
        if (img.name.toLowerCase().endsWith('.png')) {
          formatType = 'png';
        }

        imagePayloads.push({
          buffer: img.arrayBuffer!,
          type: formatType,
        });
      }

      setProcessingState((prev) => ({
        ...prev,
        progress: 60,
        statusMessage: `Compiling ${images.length} images into PDF pages...`,
      }));

      const pdfBytes = await imagesToPdf(imagePayloads, options);

      setProcessingState((prev) => ({
        ...prev,
        progress: 90,
        statusMessage: 'Finalizing PDF output...',
      }));

      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename = `images_converted_${Date.now()}.pdf`;

      const totalSize = images.reduce((acc, curr) => acc + curr.size, 0);

      setProcessingState({
        isProcessing: false,
        progress: 100,
        statusMessage: 'Complete',
        error: null,
        resultBlob: blob,
        resultUrl: url,
        resultFilename: filename,
        originalSize: totalSize,
        resultSize: blob.size,
      });

      trackEvent('processing_succeeded', { tool: 'image-to-pdf' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Conversion failed';
      setProcessingState({
        isProcessing: false,
        progress: 0,
        statusMessage: '',
        error: msg,
        resultBlob: null,
        resultUrl: null,
        resultFilename: null,
      });
      trackEvent('processing_failed', { tool: 'image-to-pdf' });
    }
  };

  const handleReset = () => {
    if (processingState.resultUrl) {
      URL.revokeObjectURL(processingState.resultUrl);
    }
    setImages([]);
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
        <span className="text-slate-900 font-medium">Image to PDF</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-semibold mb-3">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image Compiler</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Convert Images to PDF Online Free
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Combine JPG, JPEG, and PNG images into a clean, uniform PDF document. Configure page sizes, margins, and orientation with immediate client-side generation.
        </p>
      </div>

      <div className="space-y-6">
        {images.length === 0 && !processingState.resultUrl && (
          <FileDropzone
            acceptType="image"
            multiple={true}
            maxFiles={30}
            onFilesSelected={handleFilesSelected}
            title="Drop JPG or PNG photos here"
            subtitle="Upload multiple images to assemble into a single PDF"
          />
        )}

        {images.length > 0 && !processingState.resultUrl && !processingState.isProcessing && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <ReorderableFileList
              files={images}
              onReorder={setImages}
              onRemove={handleRemove}
              isImage={true}
            />

            {/* Layout Configuration */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page Format
                </label>
                <select
                  value={options.pageSize}
                  onChange={(e) => setOptions({ ...options, pageSize: e.target.value as ImageToPdfOptions['pageSize'] })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-red-600 focus:outline-hidden"
                >
                  <option value="a4">Standard A4 (595 × 842 pt)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="fit">Fit to Image Dimensions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page Orientation
                </label>
                <select
                  value={options.orientation}
                  onChange={(e) => setOptions({ ...options, orientation: e.target.value as ImageToPdfOptions['orientation'] })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-red-600 focus:outline-hidden"
                >
                  <option value="portrait">Portrait (Vertical)</option>
                  <option value="landscape">Landscape (Horizontal)</option>
                  <option value="auto">Auto-detect per Image</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page Margins
                </label>
                <select
                  value={options.margin}
                  onChange={(e) => setOptions({ ...options, margin: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-red-600 focus:outline-hidden"
                >
                  <option value={0}>No Margins (Edge to Edge)</option>
                  <option value={18}>Compact Margins (0.25 in)</option>
                  <option value={36}>Standard Margins (0.5 in)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <FileDropzone
                  acceptType="image"
                  multiple={true}
                  maxFiles={10}
                  onFilesSelected={handleFilesSelected}
                  title="Add More Images"
                  subtitle="Append more pictures"
                  className="w-full sm:w-60"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={handleConvert}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                >
                  Generate PDF ({images.length} Images)
                </button>
              </div>
            </div>
          </div>
        )}

        <ProcessingCard
          state={processingState}
          onReset={handleReset}
          toolName="image-to-pdf"
        />
      </div>

      <AdsterraPlacement placementLocation="below-tool" />

      {/* Guide section */}
      <section className="mt-16 space-y-6 text-slate-700">
        <h2 className="text-xl font-bold text-slate-900">How to Convert JPG and PNG Photos to PDF</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed">
            <strong className="block text-slate-900 text-sm mb-1">1. Select Images</strong>
            Choose JPEG or PNG photos from your computer, smartphone photo reel, or camera roll.
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed">
            <strong className="block text-slate-900 text-sm mb-1">2. Adjust Layout</strong>
            Pick standard A4 or US Letter page formats, select portrait or landscape, and configure margin spacing.
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed">
            <strong className="block text-slate-900 text-sm mb-1">3. Download PDF</strong>
            Images are embedded losslessly without server upload or watermark stamps.
          </div>
        </div>
      </section>

      <RelatedTools currentPath="/image-to-pdf" navigate={navigate} />
    </div>
  );
};
