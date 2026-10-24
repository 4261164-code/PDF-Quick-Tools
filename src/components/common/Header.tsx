import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ShieldCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Guides', path: '/pdf-guides' },
    { label: 'Privacy', path: '/privacy' },
  ];

  const tools = [
    { label: 'Merge PDF', path: '/merge-pdf', desc: 'Combine multiple documents' },
    { label: 'Split PDF', path: '/split-pdf', desc: 'Extract pages to new files' },
    { label: 'Compress PDF', path: '/compress-pdf', desc: 'Reduce file size without loss' },
    { label: 'Image to PDF', path: '/image-to-pdf', desc: 'Convert photos to document' },
    { label: 'Extract Pages', path: '/extract-pdf-pages', desc: 'Pull specific page ranges' },
    { label: 'Rotate PDF', path: '/rotate-pdf', desc: 'Fix page orientation' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setToolsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-bg/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand */}
        <a
          href="/"
          onClick={(e) => handleNav('/', e)}
          className="whitespace-nowrap shrink-0 group transition-transform hover:scale-[1.02] active:scale-95"
          aria-label="PDF Quick Tools Home"
        >
          <Logo size="md" />
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {/* Tools Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
                toolsMenuOpen || tools.some(t => t.path === currentPath)
                  ? 'text-brand-primary bg-brand-primary/5'
                  : 'text-text-secondary hover:text-text-primary hover:bg-black/5'
              }`}
            >
              <span>PDF Tools</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {toolsMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-surface-main rounded-xl border border-border-subtle shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-1">
                <div className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-text-secondary opacity-50 border-b border-border-subtle mb-1">
                  Utilities
                </div>
                {tools.map((tool) => (
                  <a
                    key={tool.path}
                    href={tool.path}
                    onClick={(e) => handleNav(tool.path, e)}
                    className="group flex flex-col px-4 py-2.5 hover:bg-brand-primary/5 transition-colors"
                  >
                    <span className={`text-sm font-semibold transition-colors ${currentPath === tool.path ? 'text-brand-primary' : 'text-text-primary group-hover:text-brand-primary'}`}>
                      {tool.label}
                    </span>
                    <span className="text-[11px] text-text-secondary line-clamp-1">
                      {tool.desc}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNav(link.path, e)}
                className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center ${
                  isActive
                    ? 'text-brand-primary bg-brand-primary/5'
                    : 'text-text-secondary hover:text-text-primary hover:bg-black/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-text-secondary bg-surface-main px-3 py-1.5 rounded-full border border-border-subtle">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Local Processing</span>
          </div>
          <button
            type="button"
            onClick={(e) => handleNav('/merge-pdf', e)}
            className="min-h-[44px] px-6 py-2 text-sm font-bold text-white bg-brand-primary hover:bg-brand-hover active:scale-95 rounded-full transition-all shadow-md shadow-brand-primary/20 whitespace-nowrap shrink-0 inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Get Started
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 text-text-primary hover:text-brand-primary rounded-xl hover:bg-brand-primary/5 transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-surface-main animate-in fade-in slide-in-from-right-10 overflow-y-auto">
          <div className="px-4 py-8 space-y-8">
            {/* Tools Grid */}
            <div className="space-y-4">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-black text-text-secondary opacity-50 px-2">
                PDF Utilities
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {tools.map((tool) => (
                  <a
                    key={tool.path}
                    href={tool.path}
                    onClick={(e) => handleNav(tool.path, e)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      currentPath === tool.path
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm'
                        : 'border-border-subtle bg-surface-bg/50 text-text-primary active:bg-brand-primary/5'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-base font-bold">{tool.label}</span>
                      <span className="text-xs text-text-secondary">{tool.desc}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-30" />
                  </a>
                ))}
              </div>
            </div>

            {/* Other Links */}
            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <div className="grid grid-cols-2 gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => handleNav(link.path, e)}
                    className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${
                      currentPath === link.path
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm'
                        : 'border-border-subtle bg-surface-bg/50 text-text-secondary active:bg-brand-primary/5'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-bold">100% Client-side</span>
                <span className="text-[11px] opacity-80">Documents never leave your device.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
