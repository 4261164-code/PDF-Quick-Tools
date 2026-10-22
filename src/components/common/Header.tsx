import React, { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Merge', path: '/merge-pdf' },
    { label: 'Split', path: '/split-pdf' },
    { label: 'Compress', path: '/compress-pdf' },
    { label: 'Image to PDF', path: '/image-to-pdf' },
    { label: 'Guides', path: '/pdf-guides' },
  ];

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => handleNav('/', e)}
          className="whitespace-nowrap shrink-0 group transition-opacity hover:opacity-95"
          aria-label="PDF Quick Tools Home"
        >
          <Logo size="md" />
        </a>

        {/* Zone 2: Navigation Links (Single-line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNav(link.path, e)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-red-600 border-red-600 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-950 hover:border-slate-300'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Upload Privacy</span>
          </div>
          <button
            onClick={(e) => handleNav('/merge-pdf', e)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-md transition-colors shadow-sm whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Open Merge Tool
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2 shadow-lg">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 pb-2 mb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Client-side. Documents never leave your device.</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <a
              href="/merge-pdf"
              onClick={(e) => handleNav('/merge-pdf', e)}
              className="p-2.5 rounded-md hover:bg-slate-50 text-slate-800 font-medium"
            >
              Merge PDF
            </a>
            <a
              href="/split-pdf"
              onClick={(e) => handleNav('/split-pdf', e)}
              className="p-2.5 rounded-md hover:bg-slate-50 text-slate-800 font-medium"
            >
              Split PDF
            </a>
            <a
              href="/compress-pdf"
              onClick={(e) => handleNav('/compress-pdf', e)}
              className="p-2.5 rounded-md hover:bg-slate-50 text-slate-800 font-medium"
            >
              Compress PDF
            </a>
            <a
              href="/image-to-pdf"
              onClick={(e) => handleNav('/image-to-pdf', e)}
              className="p-2.5 rounded-md hover:bg-slate-50 text-slate-800 font-medium"
            >
              Image to PDF
            </a>
            <a
              href="/extract-pdf-pages"
              onClick={(e) => handleNav('/extract-pdf-pages', e)}
              className="p-2.5 rounded-md hover:bg-slate-50 text-slate-800 font-medium"
            >
              Extract Pages
            </a>
            <a
              href="/rotate-pdf"
              onClick={(e) => handleNav('/rotate-pdf', e)}
              className="p-2.5 rounded-md hover:bg-slate-50 text-slate-800 font-medium"
            >
              Rotate PDF
            </a>
          </div>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs text-slate-600">
            <a
              href="/pdf-guides"
              onClick={(e) => handleNav('/pdf-guides', e)}
              className="py-1.5 px-2 hover:text-slate-900 font-medium"
            >
              PDF Guides & Tutorials
            </a>
            <a
              href="/privacy"
              onClick={(e) => handleNav('/privacy', e)}
              className="py-1.5 px-2 hover:text-slate-900"
            >
              Privacy & Zero-Upload Guarantee
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
