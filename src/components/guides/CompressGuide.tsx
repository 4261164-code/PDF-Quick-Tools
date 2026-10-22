import React from 'react';
import { Minimize2, ArrowRight, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import { RelatedTools } from '../common/RelatedTools';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';

interface GuideProps {
  navigate: (path: string) => void;
}

const COMPRESS_FAQS: FaqItem[] = [
  {
    question: 'How much can I realistically compress a PDF?',
    answer: 'Lossless structural stream rewriting typically yields 10% to 35% reduction on documents with uncompressed object tables and authoring metadata bloat. If a document contains high-DPI scans, image downsampling can achieve 60% to 80% savings.',
  },
  {
    question: 'Why did my PDF not get smaller when using compression?',
    answer: 'If your PDF is already composed of scans compressed using JPEG-2000 or JBIG2 encoding, lossless rewriting cannot shrink image bytes without reducing resolution. We report actual byte changes without fabricating progress.',
  },
  {
    question: 'Will PDF compression blur or pixelate my text?',
    answer: 'No. Our lossless optimization targets cross-reference dictionaries, authoring metadata, and Deflate object streams. All vector typography, bounding boxes, and lines remain 100% sharp.',
  },
  {
    question: 'Is it safe to compress confidential legal or tax documents?',
    answer: 'Yes. Processing runs entirely in your local browser sandbox via JavaScript without uploading your documents to any external server.',
  },
];

export const CompressGuide: React.FC<GuideProps> = ({ navigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Dynamic Schema.org FAQPage JSON-LD */}
      <FaqJsonLd items={COMPRESS_FAQS} />

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
        <span className="text-slate-900 font-medium">How to Compress a PDF</span>
      </nav>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span>Optimization</span>
          <span aria-hidden="true">·</span>
          <span>6 min read</span>
          <span aria-hidden="true">·</span>
          <span>Updated October 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
          How to Compress a PDF: The Truth About File Sizes, Lossless Rewrites & Image Downsampling
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          An honest technical exploration into how PDF compression works, why some PDFs cannot be shrunk without quality loss, and how to optimize large files for email attachments.
        </p>
      </header>

      {/* CTA */}
      <div className="my-6 p-4 rounded-xl bg-red-50/70 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Need to compress a PDF right away?</h2>
          <p className="text-xs text-slate-600 mt-0.5">Try our honest Compress PDF tool with exact byte tracking.</p>
        </div>
        <a
          href="/compress-pdf"
          onClick={(e) => handleNav('/compress-pdf', e)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <span>Open Compress Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 mt-8">The Myth of Magic PDF Compression</h2>
        <p>
          Many utility websites claim they can reduce every PDF by "90% with zero quality loss". In the real world of digital document architecture, that is technically false. A PDF is a binary bundle made of three primary constituents:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 pl-2">
          <li><strong>Structural Objects:</strong> Catalog dictionaries, page definitions, cross-reference tables (XREFs), and font descriptors.</li>
          <li><strong>Vector Instructions & Text:</strong> Glyphs, bounding boxes, character codes, and vector lines.</li>
          <li><strong>Raster Image Payloads:</strong> High-resolution photos, scanned pages, and screenshots (typically JPEG, JPEG 2000, or JBIG2).</li>
        </ul>
        <p>
          If your document is a multi-page legal agreement composed purely of text, it may only weigh 150 Kilobytes. Attempting to reduce that to 15KB is impossible because text instructions are already heavily compressed by standard Flate/Deflate algorithms.
        </p>

        <h2 className="text-lg font-bold text-slate-900 mt-8">What Lossless Compression Actually Does</h2>
        <p>
          Lossless structural compression operates without altering any image pixel or font curve:
        </p>
        <div className="space-y-3">
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">1. Object Stream Wrapping</h3>
            <p className="text-xs text-slate-600 mt-1">
              Legacy PDF 1.4 documents kept individual numbers and dictionary tokens uncompressed. Modern PDF 1.5+ object streams bundle these objects into compressed Deflate chunks, commonly shaving 10% to 30% off bloated documents.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">2. Stripping Authoring Bloat</h3>
            <p className="text-xs text-slate-600 mt-1">
              Word processors and desktop publishing apps frequently inject embedded thumbnail previews, unused XML metadata, print color profiles (ICC profiles), and historical edit revisions. Stripping these leaves a clean, production-ready document.
            </p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mt-8">When Scans Are 50MB+</h2>
        <p>
          If an office flatbed scanner created your PDF at 600 DPI, each page can weigh 10MB of uncompressed photographic data. For email attachments (typically capped at 20MB or 25MB), downsampling image resolution from 600 DPI to 150 DPI provides tremendous savings with negligible visual degradation when viewed on standard computer screens or printed on letterhead.
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
          <h3 className="font-semibold text-slate-900 text-sm">Best Practices Before Compressing</h3>
          <p>• <strong>Keep original backups:</strong> Always keep a master copy of critical documents before applying lossy compression.</p>
          <p>• <strong>Check submission limits:</strong> Most government portal uploads (e.g. IRS, Companies House, court portals) set strict 5MB–10MB ceilings.</p>
          <p>• <strong>Test zoomed readability:</strong> Ensure small footnotes (e.g. 8pt legal disclaimers) remain legible after compression.</p>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {COMPRESS_FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdsterraPlacement placementLocation="guide-footer" />
      <RelatedTools currentPath="/pdf-guides/how-to-compress-a-pdf" navigate={navigate} />
    </article>
  );
};
