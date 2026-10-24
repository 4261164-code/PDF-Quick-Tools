import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Sliders, ArrowLeft, Plus, ShieldCheck, HelpCircle, Layout, Maximize, Ruler } from 'lucide-react';
import { FileDropzone } from '../common/FileDropzone';
import { ReorderableFileList } from '../common/ReorderableFileList';
import { ProcessingCard } from '../common/ProcessingCard';
import { RelatedTools } from '../common/RelatedTools';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import type { FileItem, ProcessingState, ImageToPdfOptions } from '../../types';
import { imagesToPdf } from '../../utils/pdfOperations';
import { validateImageSignature } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';
import { ToolJsonLd } from '../common/ToolJsonLd';

interface ToolProps {
  navigate: (path: string) => void;
}

const IMAGE_TO_PDF_FAQS: FaqItem[] = [
  {
    question: 'What image file formats can I convert to PDF?',
    answer: 'Our converter supports JPG, JPEG, and PNG image files. All image formats are validated using binary file signature checks before processing.',
  },
  {
    question: 'Can I customize the page orientation and margins?',
    answer: 'Yes. You can select between A4 and US Letter document standards, choose Portrait or Landscape orientation, and set edge-to-edge (no margins), 0.25-inch compact margins, or 0.5-inch standard margins.',
  },
  {
    question: 'Can I combine multiple pictures into one PDF?',
    answer: 'Yes. You can upload multiple photos simultaneously and reorder them using the sequence list before generating your compiled multi-page PDF document.',
  },
  {
    question: 'Does converting images to PDF reduce image sharpness?',
    answer: 'No. The images are embedded directly into PDF image XObjects preserving native color profiles and pixel resolution without lossy re-encoding.',
  },
];

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
      await validateImageSignature(file);
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

    if (processingState.resultUrl) {
      URL.revokeObjectURL(processingState.resultUrl);
    }

    trackEvent('processing_started', { tool: 'image-to-pdf' });

    setProcessingState({
      isProcessing: true,
      progress: 20,
      statusMessage: 'Loading images...',
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
        statusMessage: `Compiling PDF pages...`,
      }));

      const pdfBytes = await imagesToPdf(imagePayloads, options);

      setProcessingState((prev) => ({
        ...prev,
        progress: 90,
        statusMessage: 'Finalizing PDF binary...',
      }));

      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename = `converted_images_${Date.now()}.pdf`;

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <ToolJsonLd
        name="Convert Images to PDF Online - PDF Quick Tools"
        url="https://pdf-quick-tools.vercel.app/image-to-pdf"
        applicationSubCategory="Image to PDF Converter"
        description="Convert JPG, JPEG, and PNG images into a clean, standardized PDF with custom margins, orientation, and layout. 100% private in-browser processing."
        featureList={[
          "Batch convert multiple JPG and PNG pictures into a single PDF document",
          "Customizable page sizes (Standard A4, US Letter, or Fit to Image)",
          "Orientation controls (Portrait, Landscape, or Auto-detect per photo)",
          "Configurable margin spacing (No margins, compact 0.25in, or standard 0.5in)",
          "Zero server uploads: 100% client-side memory processing",
        ]}
      />
      <FaqJsonLd items={IMAGE_TO_PDF_FAQS} />

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
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Compiler</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]">
            Images to PDF <br className="hidden sm:block" />
            <span className="text-brand-primary">Instantly.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
            Transform your photos into professional multi-page documents. 
            Perfect for portfolios, receipts, or project scans with zero server upload.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-8">
          {images.length === 0 && !processingState.resultUrl && (
            <FileDropzone
              acceptType="image"
              multiple={true}
              maxFiles={30}
              onFilesSelected={handleFilesSelected}
            />
          )}

          {images.length > 0 && !processingState.resultUrl && !processingState.isProcessing && (
            <div className="space-y-8">
              <div className="bg-surface-main border border-border-subtle rounded-2xl p-8 shadow-xl shadow-text-primary/5">
                <ReorderableFileList
                  files={images}
                  onReorder={setImages}
                  onRemove={handleRemove}
                  isImage={true}
                />

                {/* Layout Configuration */}
                <div className="mt-12 pt-10 border-t border-border-subtle/50 grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/70">
                      <Layout className="w-3 h-3 text-brand-primary" />
                      Page Format
                    </label>
                    <div className="relative group">
                      <select
                        value={options.pageSize}
                        onChange={(e) => setOptions({ ...options, pageSize: e.target.value as ImageToPdfOptions['pageSize'] })}
                        className="w-full h-12 pl-4 pr-10 text-xs font-bold bg-surface-bg border border-border-subtle rounded-xl appearance-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-hidden cursor-pointer"
                      >
                        <option value="a4">Standard A4</option>
                        <option value="letter">US Letter</option>
                        <option value="fit">Fit to Image</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary/40 group-hover:text-brand-primary transition-colors">
                        <Sliders className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/70">
                      <Maximize className="w-3 h-3 text-brand-primary" />
                      Orientation
                    </label>
                    <div className="relative group">
                      <select
                        value={options.orientation}
                        onChange={(e) => setOptions({ ...options, orientation: e.target.value as ImageToPdfOptions['orientation'] })}
                        className="w-full h-12 pl-4 pr-10 text-xs font-bold bg-surface-bg border border-border-subtle rounded-xl appearance-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-hidden cursor-pointer"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                        <option value="auto">Auto-detect</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary/40 group-hover:text-brand-primary transition-colors">
                        <Sliders className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/70">
                      <Ruler className="w-3 h-3 text-brand-primary" />
                      Margins
                    </label>
                    <div className="relative group">
                      <select
                        value={options.margin}
                        onChange={(e) => setOptions({ ...options, margin: parseInt(e.target.value, 10) })}
                        className="w-full h-12 pl-4 pr-10 text-xs font-bold bg-surface-bg border border-border-subtle rounded-xl appearance-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-hidden cursor-pointer"
                      >
                        <option value={0}>Edge to Edge</option>
                        <option value={18}>Compact (0.25")</option>
                        <option value={36}>Standard (0.5")</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary/40 group-hover:text-brand-primary transition-colors">
                        <Sliders className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border-subtle/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.multiple = true;
                      input.accept = 'image/jpeg,image/png,image/webp';
                      input.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.files) handleFilesSelected(Array.from(target.files));
                      };
                      input.click();
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-hover transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add more images</span>
                  </button>

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 sm:flex-none h-12 px-6 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleConvert}
                      className="flex-1 sm:flex-none h-12 px-10 text-sm font-black uppercase tracking-widest text-white bg-brand-primary hover:bg-brand-hover rounded-full shadow-lg shadow-brand-primary/25 transition-all active:scale-95"
                    >
                      Generate PDF
                    </button>
                  </div>
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

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="p-8 bg-surface-main border border-border-subtle rounded-2xl space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">
              Private Conversion
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">In-Browser</p>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    Binary encoding occurs in memory. Your photos never touch a server.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Native Quality</p>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    Embedded losslessly. Original pixel resolution and colors are maintained.
                  </p>
                </div>
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
              The Digital <br />
              <span className="text-brand-primary">Scan Standard.</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">01</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Select Assets</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Upload multiple JPG or PNG images. Our engine identifies dimensions instantly.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">02</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Configure Layout</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Adjust page size and orientation. Perfect for standardizing disparate image sizes.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-black text-brand-primary/20 tabular-nums">03</span>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-text-primary">Compile Binary</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Images are bundled into a single, compact PDF document for easy sharing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight text-text-primary">
              Conversion <br />
              <span className="text-brand-primary">F.A.Q.</span>
            </h2>
            <div className="space-y-4">
              {IMAGE_TO_PDF_FAQS.map((faq, idx) => (
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

      <RelatedTools currentPath="/image-to-pdf" navigate={navigate} />
    </div>
  );
};

