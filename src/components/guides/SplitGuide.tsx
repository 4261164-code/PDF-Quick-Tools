import React from 'react';
import { Scissors, ArrowRight, ShieldCheck, CheckCircle2, HelpCircle, BookOpen, Clock, Calendar, Tag, FileStack } from 'lucide-react';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import { RelatedTools } from '../common/RelatedTools';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';
import { HowToJsonLd, HowToStep } from '../common/HowToJsonLd';

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

const SPLIT_STEPS: HowToStep[] = [
  {
    name: 'Upload Your PDF Document',
    text: 'Navigate to the Split PDF tool and drop your multi-page document into the upload dropzone.',
    url: 'https://pdf-quick-tools.vercel.app/split-pdf',
  },
  {
    name: 'Define Page Ranges or Extract Every Page',
    text: 'Enter custom range formulas like 1-3, 5, 8-10 or select Extract Every Page to separate every page individually.',
    url: 'https://pdf-quick-tools.vercel.app/split-pdf',
  },
  {
    name: 'Download Files Individually or as ZIP',
    text: 'Click Split Document and download individual output files or grab everything packaged in a ZIP archive.',
    url: 'https://pdf-quick-tools.vercel.app/split-pdf',
  },
];

export const SplitGuide: React.FC<GuideProps> = ({ navigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface-bg min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Dynamic Schema.org FAQPage & HowTo JSON-LD for AEO */}
        <FaqJsonLd items={SPLIT_FAQS} />
        <HowToJsonLd
          name="How to Split a PDF File Online"
          description="Step-by-step instructions on separating multi-page PDFs into custom page ranges or individual files."
          steps={SPLIT_STEPS}
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
          <span className="text-brand-primary">Management Protocol</span>
        </nav>

        {/* Hero Header */}
        <header className="mb-16 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-brand-primary" />
                <span>Management</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-primary" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                <span>Updated Oct 2026</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-primary leading-[1.15] lg:max-w-[30ch]">
              How to Split a Large PDF into Individual Pages or Custom Ranges
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-3xl border-l-2 border-brand-primary/20 pl-6 py-1">
              Technical methodologies for chapter isolation, confidential page excision, and batch archival segmentation using in-browser logic.
            </p>
          </div>
        </header>

        {/* Direct CTA to tool */}
        <div className="mb-16 p-8 rounded-[2rem] bg-white border border-border-subtle shadow-xl shadow-black/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-text-primary">Need to segment your files?</h2>
            <p className="text-sm text-text-secondary">Execute the split protocol with precise range selection.</p>
          </div>
          <a
            href="/split-pdf"
            onClick={(e) => handleNav('/split-pdf', e)}
            className="min-h-[52px] px-8 py-3 text-sm font-bold text-white bg-brand-primary hover:bg-brand-hover active:scale-95 rounded-full transition-all shadow-lg shadow-brand-primary/25 inline-flex items-center gap-3 whitespace-nowrap shrink-0"
          >
            <span>Launch Split Tool</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Article Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12 text-text-secondary leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">The Architecture of Page Extraction</h2>
              <p>
                Unlike paper documents that can be thumbed through and manually stapled, digital PDFs frequently arrive as monolithic bundles. Splitting is essential for chapter isolation, removing confidential appendices, and meeting file size ceilings for email gateways.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">Mastering Range Syntax</h2>
              <p>
                Our logic engine supports flexible mathematical notation for intricate extraction patterns:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    code: "1-5; 6-10",
                    desc: "Dual-file split: pages 1-5 and 6-10 as independent documents."
                  },
                  {
                    code: "1, 3, 7",
                    desc: "Isolates non-contiguous pages into a single unified output."
                  },
                  {
                    code: "1-3; 7; 10-12",
                    desc: "Generates three independent segments across the source file."
                  },
                  {
                    code: "Every Page Mode",
                    desc: "Decomposes the entire document into N individual single-page files."
                  }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white border border-border-subtle rounded-2xl space-y-3">
                    <span className="font-mono text-xs font-black text-brand-primary bg-brand-primary/5 px-2 py-1 rounded">
                      {item.code}
                    </span>
                    <p className="text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-bold text-text-primary">Operational Workflow</h2>
              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Buffer Initialization",
                    desc: "Upload the multi-page source. The tool reads the cross-reference table into memory."
                  },
                  {
                    step: "02",
                    title: "Segment Definition",
                    desc: "Input your ranges. The parser validates indices against the total document page count."
                  },
                  {
                    step: "03",
                    title: "ZIP Serialization",
                    desc: "The final segments are bundled into a ZIP archive for batch archival download."
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
              <h2 className="text-2xl font-bold text-text-primary">Confidentiality Protocol</h2>
              <p>
                When you split a PDF using our utilities, segmented files are written directly into your browser's virtual memory heap. A lightweight ZIP stream packages the files locally without contacting any external network endpoint.
              </p>
              <div className="p-8 bg-surface-main border border-border-subtle rounded-3xl space-y-4">
                <div className="flex items-center gap-3 text-brand-primary font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  No Server Intercept
                </div>
                <p className="text-sm">
                  The split operation is executed entirely within the browser sandbox, ensuring that confidential page extracts never leave your machine during processing.
                </p>
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
                {SPLIT_FAQS.map((faq, idx) => (
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
                  <Scissors className="w-24 h-24" />
                </div>
                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-bold">Segment Engine</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <span className="opacity-60 uppercase tracking-widest font-bold">Archival</span>
                      <span className="font-mono text-emerald-400">ZIP Support</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <span className="opacity-60 uppercase tracking-widest font-bold">Extraction</span>
                      <span className="font-mono">Exact Byte</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <span className="opacity-60 uppercase tracking-widest font-bold">Security</span>
                      <span className="font-mono text-brand-primary uppercase">Zero Upload</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/split-pdf')}
                    className="w-full py-3 bg-white text-text-primary rounded-full text-sm font-bold hover:bg-brand-primary hover:text-white transition-all"
                  >
                    Start Splitting
                  </button>
                </div>
              </div>

              <AdsterraPlacement placementLocation="sidebar-sticky" />
            </div>
          </aside>
        </div>

        <div className="mt-24 pt-16 border-t border-border-subtle">
          <RelatedTools currentPath="/pdf-guides/how-to-split-a-pdf" navigate={navigate} />
        </div>
        
        <div className="mt-16">
          <AdsterraPlacement placementLocation="guide-footer" />
        </div>
      </article>
    </div>
  );
};

