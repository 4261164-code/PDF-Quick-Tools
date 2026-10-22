import React from 'react';
import { BookOpen, Layers, Minimize2, Scissors, ArrowRight } from 'lucide-react';
import { LeadCapture } from '../common/LeadCapture';

interface GuideProps {
  navigate: (path: string) => void;
}

export const GuidesIndex: React.FC<GuideProps> = ({ navigate }) => {
  const guides = [
    {
      path: '/pdf-guides/how-to-merge-pdf-files',
      title: 'How to Merge PDF Files: Step-by-Step Tutorial & Best Practices',
      description: 'Learn how to combine multiple PDF documents into a unified file without losing vector text clarity, bookmarks, or forms.',
      readTime: '4 min read',
      category: 'Organization',
      icon: Layers,
    },
    {
      path: '/pdf-guides/how-to-compress-a-pdf',
      title: 'How to Compress a PDF: The Truth About File Size & Quality',
      description: 'Understand the difference between object stream rewriting and lossy rasterization. How to get smaller files while keeping text crisp.',
      readTime: '6 min read',
      category: 'Optimization',
      icon: Minimize2,
    },
    {
      path: '/pdf-guides/how-to-split-a-pdf',
      title: 'How to Split a PDF: Extract Chapters, Pages & Custom Ranges',
      description: 'A complete reference for separating multi-page documents, isolating confidential contracts, and batch archiving via ZIP.',
      readTime: '5 min read',
      category: 'Management',
      icon: Scissors,
    },
  ];

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-slate-900">
          Home
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">PDF Guides</span>
      </nav>

      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          PDF Quick Guides & Practical Documentation
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Comprehensive, non-promotional guides explaining document structures, privacy mechanics, and client-side PDF manipulation techniques.
        </p>
      </div>

      <div className="space-y-4">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <a
              key={g.path}
              href={g.path}
              onClick={(e) => handleNav(g.path, e)}
              className="block p-6 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-2xs hover:shadow-xs group"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>{g.category}</span>
                <span aria-hidden="true">·</span>
                <span>{g.readTime}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-medium">Free Tutorial</span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                      {g.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {g.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-12">
        <LeadCapture />
      </div>
    </div>
  );
};
