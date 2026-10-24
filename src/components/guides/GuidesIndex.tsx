import React from 'react';
import { BookOpen, Layers, Minimize2, Scissors, ArrowRight, Clock, Tag, ChevronRight } from 'lucide-react';
import { LeadCapture } from '../common/LeadCapture';

interface GuideProps {
  navigate: (path: string) => void;
}

export const GuidesIndex: React.FC<GuideProps> = ({ navigate }) => {
  const guides = [
    {
      path: '/pdf-guides/how-to-merge-pdf-files',
      title: 'How to Merge PDF Files',
      subtitle: 'Step-by-Step Tutorial & Best Practices',
      description: 'Learn how to combine multiple PDF documents into a unified file without losing vector text clarity, bookmarks, or forms.',
      readTime: '4 min read',
      category: 'Organization',
      icon: Layers,
      accent: 'text-rose-600 bg-rose-50',
    },
    {
      path: '/pdf-guides/how-to-compress-a-pdf',
      title: 'How to Compress a PDF',
      subtitle: 'The Truth About File Size & Quality',
      description: 'Understand the difference between object stream rewriting and lossy rasterization. How to get smaller files while keeping text crisp.',
      readTime: '6 min read',
      category: 'Optimization',
      icon: Minimize2,
      accent: 'text-emerald-600 bg-emerald-50',
    },
    {
      path: '/pdf-guides/how-to-split-a-pdf',
      title: 'How to Split a PDF',
      subtitle: 'Extract Chapters, Pages & Custom Ranges',
      description: 'A complete reference for separating multi-page documents, isolating confidential contracts, and batch archiving via ZIP.',
      readTime: '5 min read',
      category: 'Management',
      icon: Scissors,
      accent: 'text-indigo-600 bg-indigo-50',
    },
  ];

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Editorial Header */}
      <section className="relative pt-16 sm:pt-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border-subtle pb-12">
          <div className="space-y-6">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary" aria-label="Breadcrumb">
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-primary transition-colors">
                Home
              </a>
              <span className="opacity-30">/</span>
              <span className="text-brand-primary">Knowledge Base</span>
            </nav>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
                Master Your <br />
                <span className="text-brand-primary">Document Workflows.</span>
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                Technical guides and deep dives into PDF architecture, privacy-first processing, and professional document management techniques.
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[11px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-primary" />
              Expert Insights
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((g) => {
            const Icon = g.icon;
            return (
              <a
                key={g.path}
                href={g.path}
                onClick={(e) => handleNav(g.path, e)}
                className="group relative bg-surface-main border border-border-subtle rounded-[2rem] p-8 transition-all hover:shadow-2xl hover:shadow-black/[0.04] hover:-translate-y-1 active:scale-[0.98] flex flex-col h-full"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${g.accent}`}>
                    <Icon className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-text-primary" />
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {g.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {g.readTime}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                      {g.title}
                    </h2>
                    <p className="text-sm font-medium text-text-secondary opacity-60 italic">
                      {g.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed pt-2">
                    {g.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-brand-primary">
                  Read Article
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Subscription Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <LeadCapture />
      </section>
    </div>
  );
};

