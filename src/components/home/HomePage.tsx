import React from 'react';
import {
  Layers,
  Scissors,
  Minimize2,
  Image as ImageIcon,
  FileOutput,
  RotateCw,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  BookOpen,
  Check,
  X,
} from 'lucide-react';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import { LeadCapture } from '../common/LeadCapture';

interface HomeProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomeProps> = ({ navigate }) => {
  const tools = [
    {
      path: '/merge-pdf',
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into one clean document. Reorder pages with drag-and-drop before merging.',
      icon: Layers,
      highlight: 'Most Popular',
    },
    {
      path: '/split-pdf',
      title: 'Split PDF',
      description: 'Separate document pages or extraction ranges into independent PDF files or a packaged ZIP archive.',
      icon: Scissors,
      highlight: 'Multi-Page ZIP',
    },
    {
      path: '/compress-pdf',
      title: 'Compress PDF',
      description: 'Reduce file size using browser-based stream optimization with honest byte reporting and zero text blurring.',
      icon: Minimize2,
      highlight: 'Lossless Flate',
    },
    {
      path: '/image-to-pdf',
      title: 'Image to PDF',
      description: 'Convert JPG, JPEG, and PNG images into a clean PDF. Customize page sizes, orientation, and margins.',
      icon: ImageIcon,
      highlight: 'A4 & US Letter',
    },
    {
      path: '/extract-pdf-pages',
      title: 'Extract PDF Pages',
      description: 'Isolate specific page numbers or chapters from any PDF without losing vector formatting or quality.',
      icon: FileOutput,
      highlight: 'Visual Selector',
    },
    {
      path: '/rotate-pdf',
      title: 'Rotate PDF',
      description: 'Permanently rotate upside-down or sideways pages clockwise by 90°, 180°, or 270° in the document catalog.',
      icon: RotateCw,
      highlight: 'Instant Fix',
    },
  ];

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-md border border-red-200 mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Client-Side Privacy · Zero Server Uploads</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Fast, Free & Private <br className="hidden sm:inline" />
            <span className="text-red-600">PDF Quick Tools</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Merge, split, compress, convert, and rotate PDF documents directly inside your web browser. No upload queues, no subscriptions, and your files never touch an external cloud server.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/merge-pdf"
              onClick={(e) => handleNav('/merge-pdf', e)}
              className="px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm transition-all inline-flex items-center gap-2"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/pdf-guides"
              onClick={(e) => handleNav('/pdf-guides', e)}
              className="px-5 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Read PDF Guides</span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span>Free for personal & commercial use</span>
            <span aria-hidden="true">·</span>
            <span>US & UK target compliance</span>
            <span aria-hidden="true">·</span>
            <span>Mobile-friendly responsive UI</span>
          </div>
        </div>
      </section>

      {/* 6 Tools Grid */}
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Essential PDF Utilities</h2>
            <p className="text-sm text-slate-500 mt-1">Select a tool to start processing instantly</p>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">6 tools available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.path}
                href={tool.path}
                onClick={(e) => handleNav(tool.path, e)}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-6 transition-all shadow-2xs hover:shadow-sm group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 tracking-wide">
                      {tool.highlight}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Architecture & Zero-Upload Privacy Section */}
      <section className="py-16 bg-white border-y border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
              Privacy Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why Zero-Upload Browser Processing is Safer & Faster
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Most online PDF services upload your private documents to third-party cloud servers. Here is how PDF Quick Tools protects your confidential records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">100% In-Browser Execution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When you drag a file into our tool, it is parsed directly in your device's memory using JavaScript and WebAssembly. No network transmission takes place.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Instant Speed, No Queues</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Because there is no upload step or remote server processing queue, files process at the native speed of your device's multi-core CPU.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">GDPR & CCPA Compliant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Since we never receive, store, or process your files on a server, your organization retains 100% data residency and compliance without complex DPA paperwork.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden bg-white">
              <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Feature</th>
                  <th className="p-3.5 text-red-700 bg-red-50/50">PDF Quick Tools</th>
                  <th className="p-3.5 text-slate-600">Traditional Cloud Converters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3.5 font-medium text-slate-900">Document Upload to Server</td>
                  <td className="p-3.5 text-emerald-700 font-semibold bg-red-50/20">Never (0% Uploaded)</td>
                  <td className="p-3.5 text-slate-600">Always uploaded to cloud</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-slate-900">Account Registration Required</td>
                  <td className="p-3.5 text-emerald-700 font-semibold bg-red-50/20">No accounts needed</td>
                  <td className="p-3.5 text-slate-600">Often gated after 2 files</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-slate-900">File Processing Speed</td>
                  <td className="p-3.5 text-slate-900 font-semibold bg-red-50/20">Immediate local memory</td>
                  <td className="p-3.5 text-slate-600">Delayed by upload/download speeds</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-slate-900">Pricing & Limits</td>
                  <td className="p-3.5 text-emerald-700 font-semibold bg-red-50/20">100% Free, Unlimited</td>
                  <td className="p-3.5 text-slate-600">Monthly subscriptions ($12–$24/mo)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 my-16">
        <LeadCapture />
      </section>

      {/* Optional Adsterra placement */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AdsterraPlacement placementLocation="below-tool" />
      </div>

      {/* Featured Editorial Guides */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Practical PDF Guides</h2>
            <p className="text-sm text-slate-500 mt-1">Expert instructions on document manipulation</p>
          </div>
          <a
            href="/pdf-guides"
            onClick={(e) => handleNav('/pdf-guides', e)}
            className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
          >
            <span>View All Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/pdf-guides/how-to-merge-pdf-files"
            onClick={(e) => handleNav('/pdf-guides/how-to-merge-pdf-files', e)}
            className="p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Organization · 4 min read</span>
              <h3 className="text-base font-semibold text-slate-900 mt-2 group-hover:text-red-600 transition-colors">
                How to Merge PDF Files: Step-by-Step Tutorial
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Learn how to combine files without degrading vector text quality or losing form fields.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Read Tutorial</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </a>

          <a
            href="/pdf-guides/how-to-compress-a-pdf"
            onClick={(e) => handleNav('/pdf-guides/how-to-compress-a-pdf', e)}
            className="p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Optimization · 6 min read</span>
              <h3 className="text-base font-semibold text-slate-900 mt-2 group-hover:text-red-600 transition-colors">
                How to Compress a PDF: The Truth About File Sizes
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Understand lossless Deflate streams and when image downsampling is required.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Read Tutorial</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </a>

          <a
            href="/pdf-guides/how-to-split-a-pdf"
            onClick={(e) => handleNav('/pdf-guides/how-to-split-a-pdf', e)}
            className="p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Management · 5 min read</span>
              <h3 className="text-base font-semibold text-slate-900 mt-2 group-hover:text-red-600 transition-colors">
                How to Split a PDF: Custom Page Ranges & ZIP
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Step-by-step instructions for separating chapters and exporting multi-document bundles.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Read Tutorial</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </a>
        </div>
      </section>
    </div>
  );
};
