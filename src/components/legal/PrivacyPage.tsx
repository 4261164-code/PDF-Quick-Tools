import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, ChevronRight, Scale } from 'lucide-react';

interface LegalProps {
  navigate: (path: string) => void;
}

export const PrivacyPage: React.FC<LegalProps> = ({ navigate }) => {
  return (
    <div className="bg-surface-bg min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-12" aria-label="Breadcrumb">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-primary transition-colors">
            Home
          </a>
          <span className="opacity-30">/</span>
          <span className="text-brand-primary">Privacy Policy</span>
        </nav>

        {/* Header */}
        <header className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
            Zero-Upload Guarantee
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
              Privacy & <span className="text-brand-primary">Data Security.</span>
            </h1>
            <p className="text-xs font-mono text-text-secondary opacity-60 flex items-center gap-4">
              <span>Effective: Oct 2026</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Version: 1.2.0</span>
            </p>
          </div>
        </header>

        {/* Executive Summary */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-text-primary text-white rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -bottom-12 -right-12 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <ServerOff className="w-48 h-48" />
            </div>
            <div className="relative z-10 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-primary">Protocol 01</h2>
              <h3 className="text-2xl font-bold">Local Execution</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your files never leave your device. All document processing is executed entirely within your browser's local sandbox.
              </p>
            </div>
          </div>

          <div className="p-10 bg-white border border-border-subtle rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -bottom-12 -right-12 p-4 opacity-5 group-hover:scale-110 transition-transform text-brand-primary">
              <EyeOff className="w-48 h-48" />
            </div>
            <div className="relative z-10 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-primary">Protocol 02</h2>
              <h3 className="text-2xl font-bold text-text-primary">Anonymity First</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                No accounts, no email capture, and no personal data persistence. We provide pure utility without tracking identity.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-16 text-text-secondary leading-relaxed">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">01</span>
                Architectural Privacy
              </h2>
              <p>
                Unlike legacy web services that require transmitting files to a backend cloud storage cluster, <strong className="text-text-primary">PDF Quick Tools</strong> operates entirely as a browser-side client application. Processing is executed in your web browser's isolated JavaScript sandbox.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="font-mono text-[10px] bg-surface-main border border-border-subtle px-3 py-1 rounded-full uppercase tracking-widest font-bold">pdf-lib</span>
                <span className="font-mono text-[10px] bg-surface-main border border-border-subtle px-3 py-1 rounded-full uppercase tracking-widest font-bold">JSZip</span>
                <span className="font-mono text-[10px] bg-surface-main border border-border-subtle px-3 py-1 rounded-full uppercase tracking-widest font-bold">WebAssembly</span>
              </div>
              <p>
                We operate no file storage servers, no document queues, and no databases for user content. When you close your browser tab, all temporary in-memory objects are reclaimed by your system.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">02</span>
                Data Exclusion Policy
              </h2>
              <p>
                We have intentionally architected our platform to ensure the following data is <strong className="text-text-primary">never</strong> collected or stored:
              </p>
              <ul className="space-y-4">
                {[
                  "Document file contents and internal object streams.",
                  "Filenames, metadata, and authoring signatures.",
                  "Personally identifiable information (PII).",
                  "Persistent IP addresses linked to specific operations."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <ChevronRight className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">03</span>
                Anonymized Telemetry
              </h2>
              <p>
                To diagnose browser compatibility issues and measure platform performance, we record minimal, strictly anonymized aggregate usage counts. These signals contain zero identity tokens and are used exclusively for technical maintenance.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">04</span>
                Monetization Transparency
              </h2>
              <p>
                Our platform features clearly labeled external partner links or advertising resources. These are marked with <code className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-brand-primary">rel="sponsored"</code> and never masquerade as file downloads. We never pass document contents to advertising partners.
              </p>
            </section>

            <footer className="pt-16 border-t border-border-subtle">
              <div className="p-8 bg-surface-main border border-border-subtle rounded-3xl flex items-start gap-6">
                <Scale className="w-8 h-8 text-brand-primary shrink-0" />
                <div className="space-y-2">
                  <h4 className="font-bold text-text-primary text-sm uppercase tracking-widest">Legal Disclaimer</h4>
                  <p className="text-xs leading-relaxed opacity-60">
                    This privacy policy provides transparent disclosure of application data flows and does not constitute formal legal counsel. Owners should review terms with qualified legal representation for their specific jurisdiction.
                  </p>
                </div>
              </div>
            </footer>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 p-8 bg-white border border-border-subtle rounded-[2rem] shadow-sm space-y-6">
              <h3 className="font-bold text-text-primary text-lg">Contact Officer</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40">Privacy Inquiry</p>
                  <p className="text-sm font-mono text-brand-primary break-all">privacy@pdf-quick-tools.app</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40">Organization</p>
                  <p className="text-sm font-bold text-text-primary">PDF Quick Tools Network</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40">Jurisdiction</p>
                  <p className="text-sm font-bold text-text-primary">United States & United Kingdom</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/contact')}
                className="w-full py-3 bg-text-primary text-white rounded-full text-sm font-bold hover:bg-brand-primary transition-all"
              >
                Send Message
              </button>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
};

