import React from 'react';
import { Layers, Scissors, Minimize2, Image, FileOutput, RotateCw, ArrowRight } from 'lucide-react';

interface RelatedToolsProps {
  currentPath: string;
  navigate: (path: string) => void;
}

const ALL_TOOLS = [
  {
    path: '/merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple files into one single document in customized order.',
    icon: Layers,
  },
  {
    path: '/split-pdf',
    title: 'Split PDF',
    description: 'Separate document pages or extraction ranges into independent files.',
    icon: Scissors,
  },
  {
    path: '/compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce file size using browser-based stream optimization.',
    icon: Minimize2,
  },
  {
    path: '/image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert JPG, PNG, and WebP photos into clean PDF pages.',
    icon: Image,
  },
  {
    path: '/extract-pdf-pages',
    title: 'Extract PDF Pages',
    description: 'Pull specific pages or chapters from any PDF without quality loss.',
    icon: FileOutput,
  },
  {
    path: '/rotate-pdf',
    title: 'Rotate PDF',
    description: 'Rotate upside-down or sideways pages clockwise by 90°, 180°, or 270°.',
    icon: RotateCw,
  },
];

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentPath, navigate }) => {
  const filtered = ALL_TOOLS.filter((t) => t.path !== currentPath).slice(0, 3);

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="mt-32 pt-20 border-t border-border-subtle">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-text-primary tracking-tight">Explore More Utilities</h3>
          <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">Complete your document workflow</p>
        </div>
        <a
          href="/"
          onClick={(e) => handleNav('/', e)}
          className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-primary hover:text-brand-hover transition-colors"
        >
          <span>View All Tools</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((tool) => {
          const Icon = tool.icon;
          return (
            <a
              key={tool.path}
              href={tool.path}
              onClick={(e) => handleNav(tool.path, e)}
              className="group p-8 bg-surface-main border border-border-subtle hover:border-brand-primary/30 rounded-2xl transition-all shadow-lg shadow-text-primary/[0.02] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-bg text-brand-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h4 className="text-lg font-black text-text-primary group-hover:text-brand-primary transition-colors">
                  {tool.title}
                </h4>
                <p className="text-sm text-text-secondary mt-3 leading-relaxed font-medium">
                  {tool.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border-subtle/50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/40 group-hover:text-brand-primary/60 transition-colors">
                  Launch Utility
                </span>
                <ArrowRight className="w-4 h-4 text-text-secondary/30 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

