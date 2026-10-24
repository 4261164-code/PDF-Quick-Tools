import React from 'react';
import {
  Layers,
  Scissors,
  Minimize2,
  Image as ImageIcon,
  FileOutput,
  RotateCw,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  MousePointer2,
} from 'lucide-react';
import { AdsterraPlacement } from '../common/AdsterraPlacement';
import { LeadCapture } from '../common/LeadCapture';
import { FAQSection } from '../common/FAQSection';

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
      accent: 'text-rose-600 bg-rose-50',
    },
    {
      path: '/split-pdf',
      title: 'Split PDF',
      description: 'Separate document pages or extraction ranges into independent PDF files or a packaged ZIP archive.',
      icon: Scissors,
      accent: 'text-indigo-600 bg-indigo-50',
    },
    {
      path: '/compress-pdf',
      title: 'Compress PDF',
      description: 'Reduce file size using browser-based stream optimization with honest byte reporting and zero text blurring.',
      icon: Minimize2,
      accent: 'text-emerald-600 bg-emerald-50',
    },
    {
      path: '/image-to-pdf',
      title: 'Image to PDF',
      description: 'Convert JPG, JPEG, and PNG images into a clean PDF. Customize page sizes, orientation, and margins.',
      icon: ImageIcon,
      accent: 'text-amber-600 bg-amber-50',
    },
    {
      path: '/extract-pdf-pages',
      title: 'Extract PDF Pages',
      description: 'Isolate specific page numbers or chapters from any PDF without losing vector formatting or quality.',
      icon: FileOutput,
      accent: 'text-blue-600 bg-blue-50',
    },
    {
      path: '/rotate-pdf',
      title: 'Rotate PDF',
      description: 'Permanently rotate upside-down or sideways pages clockwise by 90°, 180°, or 270° in the document catalog.',
      icon: RotateCw,
      accent: 'text-violet-600 bg-violet-50',
    },
  ];

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* Editorial Hero Section */}
      <section className="relative pt-20 sm:pt-32 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary bg-surface-main px-4 py-2 rounded-full border border-border-subtle shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              100% Private Browser Operations
            </div>

            <h1 className="text-4xl sm:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] lg:max-w-[15ch]">
              Professional PDF Utilities, <span className="text-brand-primary">Redefined.</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-xl">
              Execute complex document modifications entirely in your browser. No server uploads, no data retention, and no subscription barriers.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="/merge-pdf"
                onClick={(e) => handleNav('/merge-pdf', e)}
                className="min-h-[52px] px-8 py-3 text-base font-bold text-white bg-brand-primary hover:bg-brand-hover active:scale-95 rounded-full transition-all shadow-lg shadow-brand-primary/25 inline-flex items-center gap-3"
              >
                <span>Launch Quick Tools</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="/pdf-guides"
                onClick={(e) => handleNav('/pdf-guides', e)}
                className="min-h-[52px] px-8 py-3 text-base font-bold text-text-primary bg-surface-main hover:bg-surface-bg border border-border-subtle rounded-full transition-all inline-flex items-center gap-3"
              >
                <BookOpen className="w-5 h-5 text-brand-primary" />
                <span>Documentation</span>
              </a>
            </div>

            <div className="pt-8 flex items-center gap-8 text-[11px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                No Uploads
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                No Accounts
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Unlimited
              </div>
            </div>
          </div>

          {/* Interactive Tool Preview Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-brand-primary to-rose-400 rounded-3xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative bg-white border border-border-subtle rounded-3xl p-8 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary opacity-40">Sandbox Environment</div>
                </div>
                
                <div className="space-y-6">
                  <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
                  <div className="h-32 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400">
                    <MousePointer2 className="w-8 h-8 opacity-20" />
                    <span className="text-xs font-medium">Ready for input...</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 bg-brand-primary/5 rounded-xl border border-brand-primary/10" />
                    <div className="h-10 bg-brand-primary rounded-xl" />
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 animate-bounce">
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Discovery Grid */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-border-subtle pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">Core PDF Utilities</h2>
            <p className="text-text-secondary max-w-md">Precision-engineered tools for your daily document workflow.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-text-secondary">
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand-primary" />
            06 Total Operations
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.path}
                href={tool.path}
                onClick={(e) => handleNav(tool.path, e)}
                className="group relative bg-surface-main border border-border-subtle rounded-[2rem] p-8 transition-all hover:shadow-2xl hover:shadow-black/[0.04] hover:-translate-y-1 active:scale-[0.98] flex flex-col h-full"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${tool.accent}`}>
                    <Icon className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-text-primary" />
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity">
                  Open Tool
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Trust & Architecture Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-text-primary pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-white/10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="max-w-2xl mb-16 space-y-4">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-primary">
              Security Protocol
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Privacy as a Standard, <br />Not an Option.
            </h2>
            <p className="text-lg text-slate-400">
              Unlike cloud-based services, we never see your files. Our platform utilizes modern Web API standards to process data locally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Lock,
                title: "Isolated Sandbox",
                desc: "Every operation is executed in a virtual client-side container. Your original data remains untouched and uncopied."
              },
              {
                icon: Cpu,
                title: "Instant Execution",
                desc: "By removing the network upload phase, we process large PDF documents at the speed of your device's local CPU."
              },
              {
                icon: ShieldCheck,
                title: "GDPR Compliant",
                desc: "No servers means no data storage risk. We are naturally compliant with global privacy laws by design."
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center mb-6 shadow-lg shadow-brand-primary/20">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Table Comparison */}
          <div className="mt-20 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <table className="w-full text-sm text-left bg-white/5">
              <thead className="bg-white/10 text-white font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-6">Efficiency Feature</th>
                  <th className="p-6 text-brand-primary">PDF Quick Tools</th>
                  <th className="p-6 text-slate-400">Cloud Competitors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {[
                  ["Server-Side Egress", "0% (Fully Local)", "100% (Cloud Upload)"],
                  ["Account Barriers", "None Required", "Mandatory Email"],
                  ["Processing Latency", "Local CPU Speed", "Network Bottlenecked"],
                  ["Usage Caps", "Unlimited Free", "Daily File Limits"]
                ].map(([f, pqt, cloud], i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-medium text-white">{f}</td>
                    <td className="p-6 font-bold text-emerald-400">{pqt}</td>
                    <td className="p-6 opacity-60">{cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Popular Guides Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-12 border-b border-border-subtle pb-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-text-primary">Master Your Workflows</h2>
            <p className="text-sm text-text-secondary">Expert insights into digital document management.</p>
          </div>
          <a
            href="/pdf-guides"
            onClick={(e) => handleNav('/pdf-guides', e)}
            className="text-sm font-bold text-brand-primary hover:text-brand-hover inline-flex items-center gap-1 group"
          >
            All Guides
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              path: '/pdf-guides/how-to-merge-pdf-files',
              cat: 'Organization',
              time: '4 min',
              title: 'Combining Multi-Part Dossiers'
            },
            {
              path: '/pdf-guides/how-to-compress-a-pdf',
              cat: 'Optimization',
              time: '6 min',
              title: 'The Reality of PDF Compression'
            },
            {
              path: '/pdf-guides/how-to-split-a-pdf',
              cat: 'Management',
              time: '5 min',
              title: 'Segmenting Large Batch Files'
            }
          ].map((guide, i) => (
            <a
              key={i}
              href={guide.path}
              onClick={(e) => handleNav(guide.path, e)}
              className="group space-y-4"
            >
              <div className="aspect-[16/10] bg-surface-main border border-border-subtle rounded-[2rem] p-8 flex items-center justify-center transition-all group-hover:border-brand-primary group-hover:shadow-xl group-hover:shadow-black/[0.02]">
                <BookOpen className="w-12 h-12 text-slate-200 group-hover:text-brand-primary/20 transition-colors" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                  <span>{guide.cat}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>{guide.time} Read</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                  {guide.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Subscription & Footer Resources */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <LeadCapture />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdsterraPlacement placementLocation="below-tool" />
      </div>
    </div>
  );
};
