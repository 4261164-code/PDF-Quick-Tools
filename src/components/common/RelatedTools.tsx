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
    description: 'Combine multiple PDF files into one single document in customized order.',
    icon: Layers,
  },
  {
    path: '/split-pdf',
    title: 'Split PDF',
    description: 'Separate document pages or extraction ranges into independent files or ZIP.',
    icon: Scissors,
  },
  {
    path: '/compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce file size using browser-based stream optimization and honest reporting.',
    icon: Minimize2,
  },
  {
    path: '/image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert JPG, PNG, and WebP photos into clean, standardized PDF pages.',
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
    <section className="mt-16 pt-12 border-t border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Explore Related PDF Utilities</h3>
          <p className="text-xs text-slate-500 mt-0.5">Free client-side tools to complete your document workflow</p>
        </div>
        <a
          href="/"
          onClick={(e) => handleNav('/', e)}
          className="text-xs font-medium text-red-600 hover:text-red-700 inline-flex items-center gap-1"
        >
          <span>All Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((tool) => {
          const Icon = tool.icon;
          return (
            <a
              key={tool.path}
              href={tool.path}
              onClick={(e) => handleNav(tool.path, e)}
              className="p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                  {tool.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
