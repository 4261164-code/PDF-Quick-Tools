import React from 'react';
import { Lock, Cpu, Globe, ArrowUpRight } from 'lucide-react';
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
    <footer className="mt-20 border-t border-slate-200 bg-white">
      {/* Trust & Zero-Upload Info Strip */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 text-red-600 rounded-md shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Zero File Uploads</p>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                All document processing runs inside your browser sandbox via WebAssembly and JavaScript. Your files never touch a remote server.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-md shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-xs uppercase tracking-wider">High Performance</p>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Powered by modern browser byte-streams and Web Workers. No file queues, no download throttles, and no artificial waiting screens.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-md shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-xs uppercase tracking-wider">No Accounts or Credit Cards</p>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                100% free utility designed for privacy-conscious users in the US, UK, and worldwide. No sign-up wall, no marketing spam.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Col 1: Brand */}
        <div className="col-span-2 sm:col-span-1">
          <a
            href="/"
            onClick={(e) => handleNav('/', e)}
            className="inline-block mb-3"
            aria-label="PDF Quick Tools"
          >
            <Logo size="sm" />
          </a>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Reliable, privacy-authoritative PDF tools engineered for fast daily workflows without cloud surveillance.
          </p>
          <div className="text-xs text-slate-400">
            Build v1.0 · Optimized for modern browsers
          </div>
        </div>

        {/* Col 2: Core Tools */}
        <div>
          <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Core Tools</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/merge-pdf" onClick={(e) => handleNav('/merge-pdf', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                Merge PDF
              </a>
            </li>
            <li>
              <a href="/split-pdf" onClick={(e) => handleNav('/split-pdf', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                Split PDF
              </a>
            </li>
            <li>
              <a href="/compress-pdf" onClick={(e) => handleNav('/compress-pdf', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                Compress PDF
              </a>
            </li>
            <li>
              <a href="/image-to-pdf" onClick={(e) => handleNav('/image-to-pdf', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                Image to PDF
              </a>
            </li>
            <li>
              <a href="/extract-pdf-pages" onClick={(e) => handleNav('/extract-pdf-pages', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                Extract PDF Pages
              </a>
            </li>
            <li>
              <a href="/rotate-pdf" onClick={(e) => handleNav('/rotate-pdf', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                Rotate PDF
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Practical Guides */}
        <div>
          <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">PDF Guides</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/pdf-guides" onClick={(e) => handleNav('/pdf-guides', e)} className="text-slate-600 hover:text-red-600 transition-colors font-medium">
                Guides Overview
              </a>
            </li>
            <li>
              <a href="/pdf-guides/how-to-merge-pdf-files" onClick={(e) => handleNav('/pdf-guides/how-to-merge-pdf-files', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                How to Merge PDF Files
              </a>
            </li>
            <li>
              <a href="/pdf-guides/how-to-compress-a-pdf" onClick={(e) => handleNav('/pdf-guides/how-to-compress-a-pdf', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                How to Compress a PDF
              </a>
            </li>
            <li>
              <a href="/pdf-guides/how-to-split-a-pdf" onClick={(e) => handleNav('/pdf-guides/how-to-split-a-pdf', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                How to Split a PDF
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Trust & Transparency */}
        <div>
          <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Transparency</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/privacy" onClick={(e) => handleNav('/privacy', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" onClick={(e) => handleNav('/terms', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/advertising-disclosure" onClick={(e) => handleNav('/advertising-disclosure', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                Advertising Disclosure
              </a>
            </li>
            <li>
              <a href="/contact" onClick={(e) => handleNav('/contact', e)} className="text-slate-600 hover:text-red-600 transition-colors">
                Contact & Feedback
              </a>
            </li>
            <li className="pt-2">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 transition-colors"
              >
                <span>XML Sitemap</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} PDF Quick Tools. All rights reserved.</p>
        <p className="text-slate-400">
          Client-side execution · Documents remain exclusively on your device
        </p>
      </div>
    </footer>
  );
};
