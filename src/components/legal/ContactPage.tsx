import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, ChevronRight, MapPin, Clock } from 'lucide-react';

interface LegalProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<LegalProps> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-surface-bg min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-12" aria-label="Breadcrumb">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-primary transition-colors">
            Home
          </a>
          <span className="opacity-30">/</span>
          <span className="text-brand-primary">Contact & Support</span>
        </nav>

        {/* Header */}
        <header className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary bg-surface-main px-4 py-2 rounded-full border border-border-subtle shadow-sm">
            <MessageSquare className="w-4 h-4 text-brand-primary" />
            Direct Communication
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
              Technical <span className="text-brand-primary">Feedback.</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
              Have questions regarding document compatibility, bug reports, or feature suggestions? Reach out to our engineering team.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-border-subtle rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-black/[0.02]">
              {submitted ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-text-primary">Message Received</h3>
                    <p className="text-sm text-text-secondary max-w-xs mx-auto leading-relaxed">
                      Thank you for your feedback! Our engineering team reviews all compatibility reports and feature suggestions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="min-h-[44px] px-8 py-2 text-sm font-bold text-text-primary bg-surface-main hover:bg-surface-bg border border-border-subtle rounded-full transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contactName" className="text-[10px] font-black uppercase tracking-widest text-text-secondary pl-1">Your Name</label>
                      <input
                        id="contactName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full h-12 px-4 bg-surface-bg border border-border-subtle rounded-xl text-sm text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-hidden transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactEmail" className="text-[10px] font-black uppercase tracking-widest text-text-secondary pl-1">Email Address *</label>
                      <input
                        id="contactEmail"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full h-12 px-4 bg-surface-bg border border-border-subtle rounded-xl text-sm text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contactSubject" className="text-[10px] font-black uppercase tracking-widest text-text-secondary pl-1">Inquiry Subject</label>
                    <select
                      id="contactSubject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full h-12 px-4 bg-surface-bg border border-border-subtle rounded-xl text-sm text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-hidden transition-all appearance-none cursor-pointer"
                    >
                      <option value="General Feedback">General Feedback</option>
                      <option value="Bug / PDF Compatibility Report">Bug / PDF Compatibility Report</option>
                      <option value="Feature Suggestion">Feature Suggestion</option>
                      <option value="Advertising / Partnership Inquiry">Advertising / Partnership Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contactMessage" className="text-[10px] font-black uppercase tracking-widest text-text-secondary pl-1">Your Message *</label>
                    <textarea
                      id="contactMessage"
                      rows={6}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your issue or suggestion in detail..."
                      className="w-full p-4 bg-surface-bg border border-border-subtle rounded-xl text-sm text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-hidden transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto min-h-[52px] px-10 py-3 text-sm font-bold text-white bg-brand-primary hover:bg-brand-hover active:scale-95 rounded-full transition-all shadow-lg shadow-brand-primary/25 inline-flex items-center justify-center gap-3"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar / Info */}
          <aside className="lg:col-span-5 space-y-8">
            <div className="p-8 sm:p-10 bg-text-primary text-white rounded-[2.5rem] space-y-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Mail className="w-24 h-24" />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Direct Channels</h3>
                  <p className="text-sm text-slate-400">Technical support and media inquiries are handled by our primary engineering desk.</p>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Technical Support", value: "support@pdf-quick-tools.app" },
                    { label: "Media & Advertising", value: "ads@pdf-quick-tools.app" },
                    { label: "Security & Privacy", value: "security@pdf-quick-tools.app" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
                        {item.label}
                      </p>
                      <p className="text-base font-mono break-all">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3 h-3 text-brand-primary" />
                      Regions
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">US · UK · Global</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3 text-brand-primary" />
                      Response
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">24-48 Hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-white border border-border-subtle rounded-[2rem] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-text-primary text-sm uppercase tracking-widest">Global Operations</h4>
                <p className="text-xs text-text-secondary leading-relaxed opacity-60">
                  Our team operates across multiple time zones to ensure document compatibility and tool uptime worldwide.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
};

