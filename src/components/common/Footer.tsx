import React from 'react';
import { Lock, Cpu, Globe, ArrowUpRight, ShieldCheck, Zap, Heart } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-40 border-t border-border-subtle bg-surface-bg">
      {/* Trust & Zero-Upload Info Strip */}
      <div className="border-b border-border-subtle/50 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-20">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-text-primary">Zero File Uploads</h4>
              <p className="text-xs text-text-secondary mt-3 leading-relaxed font-medium">
                Processing runs exclusively inside your browser sandbox. Your confidential documents never touch our servers or the cloud.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-text-primary">High Performance</h4>
              <p className="text-xs text-text-secondary mt-3 leading-relaxed font-medium">
                Powered by client-side WebAssembly and modern byte-streams. Experience instant conversion without waiting in cloud queues.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-text-primary">Privacy First</h4>
              <p className="text-xs text-text-secondary mt-3 leading-relaxed font-medium">
                No accounts, no cookies, and no tracking. A pure utility designed for professionals who value data sovereignty.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-2 md:grid-cols-12 gap-12 md:gap-8">
        {/* Col 1: Brand */}
        <div className="col-span-2 md:col-span-4 space-y-6">
          <a
            href="/"
            onClick={(e) => handleNav('/', e)}
            className="inline-block"
            aria-label="PDF Quick Tools"
          >
            <Logo size="sm" />
          </a>
          <p className="text-sm text-text-secondary leading-relaxed max-w-sm font-medium">
            The premium standard for client-side PDF utility. Engineered for speed, designed for privacy, and built for professionals.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/40">
            <span>Built v1.0.4</span>
            <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
            <span>Optimized Core</span>
          </div>
        </div>

        {/* Col 2: Core Tools */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-primary">Tools</h4>
          <ul className="space-y-4">
            <li>
              <a href="/merge-pdf" onClick={(e) => handleNav('/merge-pdf', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                Merge PDF
              </a>
            </li>
            <li>
              <a href="/split-pdf" onClick={(e) => handleNav('/split-pdf', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                Split PDF
              </a>
            </li>
            <li>
              <a href="/compress-pdf" onClick={(e) => handleNav('/compress-pdf', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                Compress PDF
              </a>
            </li>
            <li>
              <a href="/image-to-pdf" onClick={(e) => handleNav('/image-to-pdf', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                Image to PDF
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Practical Guides */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-primary">Resources</h4>
          <ul className="space-y-4">
            <li>
              <a href="/pdf-guides" onClick={(e) => handleNav('/pdf-guides', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                Technical Guides
              </a>
            </li>
            <li>
              <a href="/pdf-guides/how-to-merge-pdf-files" onClick={(e) => handleNav('/pdf-guides/how-to-merge-pdf-files', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                How to Merge
              </a>
            </li>
            <li>
              <a href="/pdf-guides/how-to-compress-a-pdf" onClick={(e) => handleNav('/pdf-guides/how-to-compress-a-pdf', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                How to Compress
              </a>
            </li>
            <li>
              <a href="/pdf-guides/how-to-split-a-pdf" onClick={(e) => handleNav('/pdf-guides/how-to-split-a-pdf', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                How to Split
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Trust & Transparency */}
        <div className="col-span-2 md:col-span-3 space-y-6">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-primary">Legal</h4>
          <ul className="space-y-4">
            <li>
              <a href="/privacy" onClick={(e) => handleNav('/privacy', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                Privacy Protocol
              </a>
            </li>
            <li>
              <a href="/terms" onClick={(e) => handleNav('/terms', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                Service Terms
              </a>
            </li>
            <li>
              <a href="/contact" onClick={(e) => handleNav('/contact', e)} className="text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors">
                Feedback & Contact
              </a>
            </li>
            <li className="pt-2">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/40 hover:text-brand-primary transition-colors"
              >
                <span>XML Sitemap</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 border-t border-border-subtle/50 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-xs font-bold text-text-secondary/50 uppercase tracking-widest">
          <span>© {new Date().getFullYear()}</span>
          <span>PDF Quick Tools</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-text-secondary/30">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-brand-primary fill-brand-primary" />
            <span>for the web</span>
          </div>
          <div className="h-4 w-px bg-border-subtle/50"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
            100% Client-Side
          </p>
        </div>
      </div>
    </footer>
  );
};

