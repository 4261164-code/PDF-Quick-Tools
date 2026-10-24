import React from 'react';
import { FileText, CheckCircle2, ChevronRight, Scale, AlertCircle } from 'lucide-react';

interface LegalProps {
  navigate: (path: string) => void;
}

export const TermsPage: React.FC<LegalProps> = ({ navigate }) => {
  return (
    <div className="bg-surface-bg min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-12" aria-label="Breadcrumb">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-primary transition-colors">
            Home
          </a>
          <span className="opacity-30">/</span>
          <span className="text-brand-primary">Terms of Service</span>
        </nav>

        {/* Header */}
        <header className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary bg-surface-main px-4 py-2 rounded-full border border-border-subtle shadow-sm">
            <FileText className="w-4 h-4 text-brand-primary" />
            Legal Agreement
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
              Terms of <span className="text-brand-primary">Service.</span>
            </h1>
            <p className="text-xs font-mono text-text-secondary opacity-60 flex items-center gap-4">
              <span>Effective: Oct 2026</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Version: 1.1.0</span>
            </p>
          </div>
        </header>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-16 text-text-secondary leading-relaxed">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">01</span>
                Acceptance of Terms
              </h2>
              <p>
                By accessing or using <strong className="text-text-primary">PDF Quick Tools</strong>, you agree to comply with and be bound by these Terms of Service. This is a legally binding agreement between you and the platform operators. If you do not agree to these terms, please discontinue using the service immediately.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">02</span>
                Service Description
              </h2>
              <p>
                PDF Quick Tools provides free, browser-based document utilities including merging, splitting, compressing, converting images, extracting pages, and rotating PDF files. 
              </p>
              <div className="p-8 bg-surface-main border border-border-subtle rounded-3xl space-y-4">
                <div className="flex items-center gap-3 text-brand-primary font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Local Sandbox Operation
                </div>
                <p className="text-sm">
                  All processing occurs locally within the user's web browser environment. We do not transmit document data to backend servers.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">03</span>
                Permitted Use
              </h2>
              <p>
                You agree to use this platform solely for legitimate purposes. You confirm that you possess the necessary legal authority, copyright, or authorization to manipulate any files you open with the software. Unauthorized use of copyrighted material is strictly prohibited.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">04</span>
                Warranties & Reliability
              </h2>
              <div className="p-6 border border-border-subtle rounded-2xl bg-amber-50/50 space-y-2 mb-4">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  "As Is" Basis
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  The service is provided without warranties of any kind. While we strive for ISO 32000 compatibility, we cannot guarantee that every file will process without errors.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">05</span>
                Liability Limitations
              </h2>
              <p>
                In no event shall the operators be liable for any direct, indirect, or consequential damages resulting from the use or inability to use the service. Users are strictly advised to <strong className="text-text-primary">retain original backups</strong> of all documents prior to applying modifications.
              </p>
            </section>

            <footer className="pt-16 border-t border-border-subtle">
              <div className="p-8 bg-surface-main border border-border-subtle rounded-3xl flex items-start gap-6">
                <Scale className="w-8 h-8 text-brand-primary shrink-0" />
                <div className="space-y-2">
                  <h4 className="font-bold text-text-primary text-sm uppercase tracking-widest">Compliance</h4>
                  <p className="text-xs leading-relaxed opacity-60">
                    These terms are governed by the laws of the United States and the United Kingdom. Any disputes shall be settled in the respective jurisdictions.
                  </p>
                </div>
              </div>
            </footer>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 p-8 bg-white border border-border-subtle rounded-[2rem] shadow-sm space-y-6">
              <h3 className="font-bold text-text-primary text-lg">Legal Entity</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40">Contact Support</p>
                  <p className="text-sm font-mono text-brand-primary break-all">support@pdf-quick-tools.app</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40">Jurisdiction</p>
                  <p className="text-sm font-bold text-text-primary leading-tight">State & Federal Laws of the US / England & Wales</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border-subtle">
                <p className="text-[10px] text-text-secondary opacity-40 leading-relaxed">
                  We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
};

