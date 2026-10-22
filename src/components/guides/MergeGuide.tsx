import React from 'react';
import { Layers, ArrowRight, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import { RelatedTools } from '../common/RelatedTools';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';

interface GuideProps {
  navigate: (path: string) => void;
}

const MERGE_FAQS: FaqItem[] = [
  {
    question: 'Does merging PDF files reduce print or text quality?',
    answer: 'No. Merging uses lossless structural copying of PDF page dictionaries, font glyphs, and embedded raster images. Your text and photos remain 100% identical byte-for-byte to the originals.',
  },
  {
    question: 'How many PDF files can I merge together at once?',
    answer: 'You can combine up to 30 PDF documents in a single merge session directly in your browser without file size caps or queue delays.',
  },
  {
    question: 'Are my files uploaded to a remote cloud server when merging?',
    answer: 'No. PDF Quick Tools performs all document processing locally inside your web browser sandbox. Your files never touch a remote server, ensuring complete confidentiality.',
  },
  {
    question: 'Can I merge PDF files with different page orientations?',
    answer: 'Yes. Documents containing a mix of landscape and portrait orientations retain their respective dimensions. Standard PDF viewers adapt dynamically per page.',
  },
];

export const MergeGuide: React.FC<GuideProps> = ({ navigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Dynamic Schema.org FAQPage JSON-LD */}
      <FaqJsonLd items={MERGE_FAQS} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => handleNav('/', e)} className="hover:text-slate-900">
          Home
        </a>
        <span aria-hidden="true">/</span>
        <a href="/pdf-guides" onClick={(e) => handleNav('/pdf-guides', e)} className="hover:text-slate-900">
          PDF Guides
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">How to Merge PDF Files</span>
      </nav>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span>Organization</span>
          <span aria-hidden="true">·</span>
          <span>4 min read</span>
          <span aria-hidden="true">·</span>
          <span>Updated October 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
          How to Merge Multiple PDF Files into One Document Without Quality Loss
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          A definitive, step-by-step technical guide on combining PDF documents, retaining form inputs and vector typography, and keeping data private using client-side merging.
        </p>
      </header>

      {/* Direct CTA to tool */}
      <div className="my-6 p-4 rounded-xl bg-red-50/70 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Ready to combine your files right now?</h2>
          <p className="text-xs text-slate-600 mt-0.5">Use our free zero-upload Merge PDF tool. Runs 100% in your browser.</p>
        </div>
        <a
          href="/merge-pdf"
          onClick={(e) => handleNav('/merge-pdf', e)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <span>Open Merge Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Body Content */}
      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 mt-8">Why Do We Need to Merge PDFs?</h2>
        <p>
          Whether submitting a mortgage dossier, organizing tax receipts, assembling legal briefs, or putting together an academic dissertation with supplementary charts, multi-file fragmentation causes administrative headaches. Merging binds related documents into a single sequential index that any PDF viewer on Windows, macOS, iOS, or Android can open predictably.
        </p>

        <h2 className="text-lg font-bold text-slate-900 mt-8">The Traditional Security Risk of Online Converters</h2>
        <p>
          Historically, online PDF mergers required uploading your confidential documents to an unfamiliar remote web server. Once your PDF leaves your computer:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 pl-2">
          <li>Your file can be temporarily or indefinitely cached on cloud disk volumes.</li>
          <li>Sensitive personally identifiable information (SSNs, banking records, health data) may be exposed to server-side logging.</li>
          <li>Network transmission delays bottleneck large files.</li>
        </ul>
        <p>
          With modern web technologies like WebAssembly and browser ArrayBuffers, merging no longer requires server mediation. <strong>PDF Quick Tools</strong> executes the entire ISO 32000 page dictionary duplication on your device's CPU.
        </p>

        <h2 className="text-lg font-bold text-slate-900 mt-8">Step-by-Step Instructions</h2>
        <div className="space-y-3">
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">Step 1: Stage Your Source Files</h3>
            <p className="text-xs text-slate-600 mt-1">
              Navigate to the <a href="/merge-pdf" onClick={(e) => handleNav('/merge-pdf', e)} className="text-red-600 hover:underline font-medium">Merge PDF tool</a>. Drag your PDF files into the upload area, or click "Browse Device Files" to multi-select.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">Step 2: Set the Document Sequence</h3>
            <p className="text-xs text-slate-600 mt-1">
              Verify the order of documents in the staged list. Use the up and down arrow buttons to ensure cover letters precede attachments and invoices precede receipts.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">Step 3: Trigger Merge & Download</h3>
            <p className="text-xs text-slate-600 mt-1">
              Click the "Merge Files" button. Within hundreds of milliseconds, the page catalogs are stitched together and your compiled PDF is ready for immediate saving.
            </p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mt-8">Frequently Encountered Edge Cases</h2>
        <div className="space-y-2 text-xs text-slate-600">
          <p>• <strong>Password-Protected Files:</strong> If any source PDF has an active user or owner encryption key, the merge engine cannot read page trees without the credentials. Unlock the file first.</p>
          <p>• <strong>Differing Page Orientations:</strong> If you combine an A4 portrait report with a landscape spreadsheet, both dimensions are preserved exactly. PDF viewers adapt seamlessly per page.</p>
          <p>• <strong>Vector Sharpness:</strong> Our client merger copies exact byte streams rather than rasterizing to pixels, ensuring text stays crisp at 500% zoom.</p>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {MERGE_FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdsterraPlacement placementLocation="guide-footer" />
      <RelatedTools currentPath="/pdf-guides/how-to-merge-pdf-files" navigate={navigate} />
    </article>
  );
};
