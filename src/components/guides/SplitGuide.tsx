import React from 'react';
import { Scissors, ArrowRight, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import { RelatedTools } from '../common/RelatedTools';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';

interface GuideProps {
  navigate: (path: string) => void;
}

const SPLIT_FAQS: FaqItem[] = [
  {
    question: 'Can I extract specific page ranges like pages 1 to 5 and page 8 into one document?',
    answer: 'Yes. Use comma and hyphen notation such as "1-5, 8". The parser isolates those exact pages and compiles them into a clean standalone PDF without quality loss.',
  },
  {
    question: 'How do I split a PDF into multiple distinct files at once?',
    answer: 'Use semicolons between ranges (e.g. "1-3; 4-6") or use the "+ Add Another Range" builder. Each range is exported as an independent document, and you can download all files together in a single ZIP archive.',
  },
  {
    question: 'Can I split every single page into its own individual PDF file?',
    answer: 'Yes. Select "Extract Every Page" mode. The tool automatically decomposes the document and packages every single page into an organized ZIP archive with labeled filenames.',
  },
  {
    question: 'Will splitting remove vector typography or embedded images?',
    answer: 'No. The extracted documents retain 100% vector typography, character bounding boxes, and image resolution directly from the original page streams.',
  },
];

export const SplitGuide: React.FC<GuideProps> = ({ navigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Dynamic Schema.org FAQPage JSON-LD */}
      <FaqJsonLd items={SPLIT_FAQS} />

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
        <span className="text-slate-900 font-medium">How to Split a PDF</span>
      </nav>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span>Management</span>
          <span aria-hidden="true">·</span>
          <span>5 min read</span>
          <span aria-hidden="true">·</span>
          <span>Updated October 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
          How to Split a Large PDF into Individual Pages or Custom Ranges
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Techniques for isolating specific chapters, removing confidential pages prior to external sharing, and batch exporting split documents into a single organized ZIP archive.
        </p>
      </header>

      {/* Direct CTA */}
      <div className="my-6 p-4 rounded-xl bg-red-50/70 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Need to split a PDF now?</h2>
          <p className="text-xs text-slate-600 mt-0.5">Separate custom page ranges or every single page with our free Split tool.</p>
        </div>
        <a
          href="/split-pdf"
          onClick={(e) => handleNav('/split-pdf', e)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <span>Open Split Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 mt-8">Common Scenarios for Splitting PDFs</h2>
        <p>
          Unlike paper documents that can be thumbed through and manually stapled, digital PDFs frequently arrive as monolithic 100-page bundles containing mixed confidentiality levels. Splitting is essential when:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 pl-2">
          <li><strong>Sending relevant excerpts:</strong> You only want a client or colleague to review pages 12 through 18 of a larger architectural proposal.</li>
          <li><strong>Removing confidential appendices:</strong> You need to excise salary schedules or NDA signatures before public filing.</li>
          <li><strong>Overcoming file size ceilings:</strong> Breaking a 50MB document into two 25MB volumes to satisfy email gateway quotas.</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900 mt-8">Mastering Page Range Syntax</h2>
        <p>
          Our parser supports flexible mathematical notation so you can define intricate extraction patterns in one keystroke:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="font-mono font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">1-5; 6-10</span>
            <p className="text-slate-600 mt-1">Splits the document into two files: one for the first 5 pages, and another for pages 6 through 10.</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="font-mono font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">1, 3, 7</span>
            <p className="text-slate-600 mt-1">Extracts only the odd-numbered pages 1, 3, and 7 into a single unified output.</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="font-mono font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">1-3; 7; 10-12</span>
            <p className="text-slate-600 mt-1">Generates three independent documents across non-contiguous parts of your source file.</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="font-mono font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Every Page Mode</span>
            <p className="text-slate-600 mt-1">Automatically generates N independent PDF files and bundles them into an instant ZIP archive.</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mt-8">Client-Side Archiving Security</h2>
        <p>
          When you split a PDF using <strong>PDF Quick Tools</strong>, the resulting segmented files are written directly into your browser's virtual memory heap. A lightweight ZIP stream packages the files using JSZip without contacting any external network endpoint.
        </p>

        {/* FAQ Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {SPLIT_FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdsterraPlacement placementLocation="guide-footer" />
      <RelatedTools currentPath="/pdf-guides/how-to-split-a-pdf" navigate={navigate} />
    </article>
  );
};
