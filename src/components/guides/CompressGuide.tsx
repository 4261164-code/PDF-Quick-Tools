import React from 'react';
import { Minimize2, ArrowRight, ShieldCheck, AlertCircle, HelpCircle, BookOpen, Clock, Calendar, Tag, CheckCircle2 } from 'lucide-react';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import { RelatedTools } from '../common/RelatedTools';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';
import { HowToJsonLd, HowToStep } from '../common/HowToJsonLd';

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

const COMPRESS_STEPS: HowToStep[] = [
  {
    name: 'Upload Your PDF File',
    text: 'Go to the Compress PDF tool and drag or select your document up to 100MB.',
    url: 'https://pdf-quick-tools.vercel.app/compress-pdf',
  },
  {
    name: 'Select Optimization Profile',
    text: 'Choose lossless structural Deflate stream optimization to clean metadata and remove orphaned cross-reference tables.',
    url: 'https://pdf-quick-tools.vercel.app/compress-pdf',
  },
  {
    name: 'Review Stats & Download',
    text: 'Inspect the honest byte-level reduction percentage and download your optimized PDF instantly.',
    url: 'https://pdf-quick-tools.vercel.app/compress-pdf',
  },
];

export const CompressGuide: React.FC<GuideProps> = ({ navigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface-bg min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Dynamic Schema.org FAQPage & HowTo JSON-LD for AEO */}
        <FaqJsonLd items={COMPRESS_FAQS} />
        <HowToJsonLd
          name="How to Compress a PDF File Online"
          description="Step-by-step instructions on reducing PDF file size securely in your browser with honest byte-level reporting."
          steps={COMPRESS_STEPS}
        />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-12" aria-label="Breadcrumb">
          <a href="/" onClick={(e) => handleNav('/', e)} className="hover:text-brand-primary transition-colors">
            Home
          </a>
          <span className="opacity-30">/</span>
          <a href="/pdf-guides" onClick={(e) => handleNav('/pdf-guides', e)} className="hover:text-brand-primary transition-colors">
            Knowledge Base
          </a>
          <span className="opacity-30">/</span>
          <span className="text-brand-primary">Optimization Protocol</span>
        </nav>

        {/* Hero Header */}
        <header className="mb-16 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-brand-primary" />
                <span>Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-primary" />
                <span>6 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                <span>Updated Oct 2026</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-primary leading-[1.15] lg:max-w-[30ch]">
              How to Compress a PDF: The Reality of Lossless Structural Optimization
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-3xl border-l-2 border-brand-primary/20 pl-6 py-1">
              An honest technical exploration into how PDF compression works, why some documents cannot be shrunk, and how to optimize large files for professional delivery.
            </p>
          </div>
        </header>

        {/* Direct CTA to tool */}
        <div className="mb-16 p-8 rounded-[2rem] bg-white border border-border-subtle shadow-xl shadow-black/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-text-primary">Need to shrink your files?</h2>
            <p className="text-sm text-text-secondary">Execute structural stream rewriting with honest byte reporting.</p>
          </div>
          <a
            href="/compress-pdf"
            onClick={(e) => handleNav('/compress-pdf', e)}
            className="min-h-[52px] px-8 py-3 text-sm font-bold text-white bg-brand-primary hover:bg-brand-hover active:scale-95 rounded-full transition-all shadow-lg shadow-brand-primary/25 inline-flex items-center gap-3 whitespace-nowrap shrink-0"
          >
            <span>Launch Compress Tool</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Article Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12 text-text-secondary leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">The Myth of Infinite Compression</h2>
              <p>
                Many utility websites claim they can reduce every PDF by "90% with zero quality loss". Technically, this is often fabricated. A PDF is a complex binary container made of structural objects, vector instructions, and raster image payloads.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">Lossless Rewriting Explained</h2>
              <p>
                Our compression targets authoring metadata, orphaned cross-reference tables, and uncompressed object streams.
              </p>
              <div className="p-8 bg-surface-main border border-border-subtle rounded-3xl space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-brand-primary font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Object Stream Wrapping
                  </div>
                  <p className="text-sm">
                    Modern PDF 1.5+ object streams bundle dictionary tokens into compressed Deflate chunks, commonly shaving 10% to 30% off bloated documents.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-brand-primary font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Metadata Stripping
                  </div>
                  <p className="text-sm">
                    Word processors often inject embedded thumbnail previews and ICC color profiles. Stripping these leaves a clean, production-ready document.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-bold text-text-primary">Optimization Workflow</h2>
              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Buffer Initialization",
                    desc: "Drag your document into the workspace. The engine reads the binary stream into a client-side ArrayBuffer."
                  },
                  {
                    step: "02",
                    title: "Structural Scan",
                    desc: "The protocol identifies uncompressed object streams and orphaned metadata for surgical removal."
                  },
                  {
                    step: "03",
                    title: "Deflate Rewriting",
                    desc: "The final document is re-serialized with optimized cross-reference tables for immediate local saving."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-2xl hover:bg-white transition-colors group">
                    <span className="text-2xl font-black text-brand-primary/20 group-hover:text-brand-primary transition-colors font-mono">
                      {item.step}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-bold text-text-primary">{item.title}</h3>
                      <p className="text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">Handling Scanned Documents</h2>
              <p>
                If your PDF is composed of high-DPI scans, structural optimization alone may not suffice. In these cases, image downsampling from 600 DPI to 150 DPI is required to meet email attachment limits (typically &lt; 20MB).
              </p>
              <div className="p-6 border border-border-subtle rounded-2xl bg-amber-50/50 space-y-2">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Pre-Compression Protocol
                </h4>
                <p className="text-xs text-amber-800">Always retain a master copy before applying lossy image downsampling for critical archival records.</p>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="pt-16 border-t border-border-subtle space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {COMPRESS_FAQS.map((faq, idx) => (
                  <div key={idx} className="p-8 bg-white border border-border-subtle rounded-3xl space-y-3 shadow-sm">
                    <h3 className="text-base font-bold text-text-primary">{faq.question}</h3>
                    <p className="text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              <div className="p-8 rounded-[2rem] bg-text-primary text-white space-y-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Minimize2 className="w-24 h-24" />
                </div>
                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-bold">Optimization</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <span className="opacity-60 uppercase tracking-widest font-bold">Standard</span>
                      <span className="font-mono">PDF 1.7</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <span className="opacity-60 uppercase tracking-widest font-bold">Algorithm</span>
                      <span className="font-mono text-emerald-400">Deflate</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <span className="opacity-60 uppercase tracking-widest font-bold">Privacy</span>
                      <span className="font-mono text-brand-primary uppercase">No Server</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/compress-pdf')}
                    className="w-full py-3 bg-white text-text-primary rounded-full text-sm font-bold hover:bg-brand-primary hover:text-white transition-all"
                  >
                    Start Optimizing
                  </button>
                </div>
              </div>

              <AdsterraPlacement placementLocation="sidebar-sticky" />
            </div>
          </aside>
        </div>

        <div className="mt-24 pt-16 border-t border-border-subtle">
          <RelatedTools currentPath="/pdf-guides/how-to-compress-a-pdf" navigate={navigate} />
        </div>
        
        <div className="mt-16">
          <AdsterraPlacement placementLocation="guide-footer" />
        </div>
      </article>
    </div>
  );
};

