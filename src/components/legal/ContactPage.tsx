import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-slate-900">
          Home
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Contact & Support</span>
      </nav>

      <header className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Contact & Technical Feedback
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Have questions regarding document compatibility, bug reports, feature suggestions, or business inquiries? Reach out to our engineering team below.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact info placeholders */}
        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <h2 className="font-semibold text-slate-900 text-sm">Direct Inquiries</h2>
            <p>
              Support: <span className="font-mono text-slate-800">[SUPPORT_EMAIL_PLACEHOLDER]</span>
            </p>
            <p>
              Media / Ads: <span className="font-mono text-slate-800">[ADVERTISING_EMAIL_PLACEHOLDER]</span>
            </p>
            <p>
              Security: <span className="font-mono text-slate-800">[SECURITY_EMAIL_PLACEHOLDER]</span>
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <h2 className="font-semibold text-slate-900 text-sm">Target Regions</h2>
            <p>United States · United Kingdom · Worldwide</p>
            <p className="text-[11px] text-slate-400 mt-2">
              Response window: Within 24–48 business hours
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for your feedback! Our engineering team reviews all compatibility reports and feature suggestions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactName" className="block font-medium text-slate-700 mb-1">Your Name</label>
                  <input
                    id="contactName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:border-red-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    id="contactEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:border-red-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactSubject" className="block font-medium text-slate-700 mb-1">Inquiry Subject</label>
                <select
                  id="contactSubject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:border-red-600 focus:outline-hidden"
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="Bug / PDF Compatibility Report">Bug / PDF Compatibility Report</option>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="Advertising / Partnership Inquiry">Advertising / Partnership Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="contactMessage" className="block font-medium text-slate-700 mb-1">Your Message *</label>
                <textarea
                  id="contactMessage"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or suggestion in detail..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:border-red-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
