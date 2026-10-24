import React from 'react';
import { Layers, ArrowRight, ShieldCheck, CheckCircle2, HelpCircle, BookOpen, Clock, Calendar, Tag } from 'lucide-react';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import { RelatedTools } from '../common/RelatedTools';
import { FaqJsonLd, FaqItem } from '../common/FaqJsonLd';
import { HowToJsonLd, HowToStep } from '../common/HowToJsonLd';

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

const MERGE_STEPS: HowToStep[] = [
  {
    name: 'Stage Your Source Files',
    text: 'Navigate to the Merge PDF tool, then drag and drop your PDF files into the upload box or click Browse Device Files.',
    url: 'https://pdf-quick-tools.vercel.app/merge-pdf',
  },
  {
    name: 'Set Document Sequence',
    text: 'Review the staged file list and use the up and down arrow buttons or drag handles to organize documents in the exact order you want.',
    url: 'https://pdf-quick-tools.vercel.app/merge-pdf',
  },
  {
    name: 'Merge and Download',
    text: 'Click the Merge button to combine documents in your browser memory within milliseconds and download your final PDF instantly.',
    url: 'https://pdf-quick-tools.vercel.app/merge-pdf',
  },
];

export const MergeGuide: React.FC<GuideProps> = ({ navigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface-bg min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Dynamic Schema.org FAQPage & HowTo JSON-LD for AEO */}
        <FaqJsonLd items={MERGE_FAQS} />
        <HowToJsonLd
          name="How to Merge PDF Files Online"
          description="Step-by-step instructions on combining multiple PDF documents securely in your browser without file uploads."
          steps={MERGE_STEPS}
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
          <span className="text-brand-primary">Merge Protocol</span>
        </nav>

        {/* Hero Header */}
        <header className="mb-16 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-brand-primary" />
                <span>Organization</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-primary" />
                <span>4 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                <span>Updated Oct 2026</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-primary leading-[1.15] lg:max-w-[30ch]">
              How to Merge PDF Files into a Unified Document Without Quality Loss
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-3xl border-l-2 border-brand-primary/20 pl-6 py-1">
              A definitive technical guide on combining PDF documents, retaining form inputs and vector typography, and keeping data private using client-side merging.
            </p>
          </div>
        </header>

        {/* Direct CTA to tool */}
        <div className="mb-16 p-8 rounded-[2rem] bg-white border border-border-subtle shadow-xl shadow-black/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-text-primary">Ready to combine your files?</h2>
            <p className="text-sm text-text-secondary">Execute the merge protocol instantly in your browser sandbox.</p>
          </div>
          <a
            href="/merge-pdf"
            onClick={(e) => handleNav('/merge-pdf', e)}
            className="min-h-[52px] px-8 py-3 text-sm font-bold text-white bg-brand-primary hover:bg-brand-hover active:scale-95 rounded-full transition-all shadow-lg shadow-brand-primary/25 inline-flex items-center gap-3 whitespace-nowrap shrink-0"
          >
            <span>Launch Merge Tool</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Article Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12 text-text-secondary leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">The Case for Document Consolidation</h2>
              <p>
                Whether submitting a mortgage dossier, organizing tax receipts, or assembling legal briefs, multi-file fragmentation causes administrative friction. Merging binds related documents into a single sequential index that any PDF viewer can open predictably.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">Security Architecture: Client vs. Cloud</h2>
              <p>
                Historically, online PDF mergers required uploading confidential documents to remote servers. Once your PDF leaves your machine, you lose control over data retention and access logs.
              </p>
              <div className="p-8 bg-surface-main border border-border-subtle rounded-3xl space-y-4">
                <div className="flex items-center gap-3 text-brand-primary font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  Local Sandbox Execution
                </div>
                <p className="text-sm">
                  PDF Quick Tools utilizes WebAssembly and browser ArrayBuffers to execute the entire ISO 32000 page dictionary duplication on your device's CPU. Your files never touch a remote server.
                </p>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-bold text-text-primary">Operational Workflow</h2>
              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Source Staging",
                    desc: "Drag your PDF files into the workspace. Our engine initializes the PDF object tree in memory without persistent storage."
                  },
                  {
                    step: "02",
                    title: "Sequence Logic",
                    desc: "Organize documents using the visual reorder handles. The final output follows this exact chronological order."
                  },
                  {
                    step: "03",
                    title: "Catalyst Execution",
                    desc: "Trigger the merge. Within milliseconds, the cross-reference tables are unified and the document is ready for local download."
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
              <h2 className="text-2xl font-bold text-text-primary">Edge Case Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 border border-border-subtle rounded-2xl space-y-2">
                  <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Mixed Orientations
                  </h4>
                  <p className="text-xs">Portrait and landscape pages coexist seamlessly in the unified output.</p>
                </div>
                <div className="p-6 border border-border-subtle rounded-2xl space-y-2">
                  <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Vector Integrity
                  </h4>
                  <p className="text-xs">Original byte streams are copied, ensuring zero loss in text or vector sharpness.</p>
                </div>
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
                {MERGE_FAQS.map((faq, idx) => (
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
                  <Layers className="w-24 h-24" />
                </div>
                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-bold">Merge Engine</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <span className="opacity-60 uppercase tracking-widest font-bold">Protocol</span>
                      <span className="font-mono">ISO 32000</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <span className="opacity-60 uppercase tracking-widest font-bold">Latency</span>
                      <span className="font-mono text-emerald-400">&lt; 100ms</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <span className="opacity-60 uppercase tracking-widest font-bold">Data Privacy</span>
                      <span className="font-mono text-brand-primary uppercase">Guaranteed</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/merge-pdf')}
                    className="w-full py-3 bg-white text-text-primary rounded-full text-sm font-bold hover:bg-brand-primary hover:text-white transition-all"
                  >
                    Start Merging
                  </button>
                </div>
              </div>

              <AdsterraPlacement placementLocation="sidebar-sticky" />
            </div>
          </aside>
        </div>

        <div className="mt-24 pt-16 border-t border-border-subtle">
          <RelatedTools currentPath="/pdf-guides/how-to-merge-pdf-files" navigate={navigate} />
        </div>
        
        <div className="mt-16">
          <AdsterraPlacement placementLocation="guide-footer" />
        </div>
      </article>
    </div>
  );
};

