import React from 'react';
import { DollarSign, ExternalLink, ShieldCheck, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

interface LegalProps {
  navigate: (path: string) => void;
}

export const AdvertisingDisclosurePage: React.FC<LegalProps> = ({ navigate }) => {
  return (
    <div className="bg-surface-bg min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-12" aria-label="Breadcrumb">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-primary transition-colors">
            Home
          </a>
          <span className="opacity-30">/</span>
          <span className="text-brand-primary">Advertising Disclosure</span>
        </nav>

        {/* Header */}
        <header className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary bg-surface-main px-4 py-2 rounded-full border border-border-subtle shadow-sm">
            <DollarSign className="w-4 h-4 text-brand-primary" />
            Monetization Standards
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
              Transparency & <span className="text-brand-primary">Integrity.</span>
            </h1>
            <p className="text-xs font-mono text-text-secondary opacity-60 flex items-center gap-4">
              <span>FTC & ASA Compliance</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Publisher Verified</span>
            </p>
          </div>
        </header>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-16 text-text-secondary leading-relaxed">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary">Funding Free Utility</h2>
              <p>
                <strong className="text-text-primary">PDF Quick Tools</strong> is a free productivity platform. To fund domain hosting, infrastructure, and ongoing browser engine maintenance without charging subscriptions, we display clearly labeled sponsored links and partner recommendations.
              </p>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">01</span>
                Our Integrity Principles
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "No Deceptive Downloads",
                    desc: "We strictly prohibit fake buttons that masquerade as document output controls. Your generated PDF is always downloaded via a distinct, verified button."
                  },
                  {
                    title: "Zero Interstitial Barriers",
                    desc: "You are never forced to click an advertisement or watch a video timer to receive your processed file. Generation is unconditional."
                  },
                  {
                    title: "Total Data Isolation",
                    desc: "Because processing occurs in local memory, advertising providers never receive document names, contents, or metadata."
                  },
                  {
                    title: "Explicit Labeling",
                    desc: "Promotional resources are marked with explicit indicators and carry search-compliant sponsored tags."
                  }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-white border border-border-subtle rounded-3xl space-y-2 group hover:border-brand-primary transition-colors">
                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <span className="text-brand-primary/20 font-mono text-xl font-black">02</span>
                Reporting Objectionable Content
              </h2>
              <p>
                If you encounter a partner destination that violates ethical standards, please report it immediately. Our team maintains a strict blacklist policy for objectionable publisher inventory.
              </p>
              <div className="p-6 border border-border-subtle rounded-2xl bg-brand-primary/5 space-y-2">
                <h4 className="font-bold text-brand-primary text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Operator Oversight
                </h4>
                <p className="text-xs leading-relaxed">We audit our partner network daily to ensure user safety and document integrity standards are upheld.</p>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 p-8 bg-text-primary text-white rounded-[2rem] shadow-sm space-y-6 overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <ExternalLink className="w-24 h-24" />
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="font-bold text-lg">Partner Support</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ad Inquiries</p>
                    <p className="text-sm font-mono text-brand-primary break-all">ads@pdf-quick-tools.app</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compliance</p>
                    <p className="text-sm font-bold text-white">FTC & ASA Standardized</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full py-3 bg-white text-text-primary rounded-full text-sm font-bold hover:bg-brand-primary hover:text-white transition-all"
                >
                  Report Placement
                </button>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
};

