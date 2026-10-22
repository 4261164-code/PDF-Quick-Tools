import React from 'react';
import { DollarSign, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LegalProps {
  navigate: (path: string) => void;
}

export const AdvertisingDisclosurePage: React.FC<LegalProps> = ({ navigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-slate-900">
          Home
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Advertising Disclosure</span>
      </nav>

      <header className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Advertising Disclosure & Monetization Standards
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Compliance with FTC Guides, UK ASA Rules, and Adsterra Publisher Terms
        </p>
      </header>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>
          <strong>PDF Quick Tools</strong> is a free productivity platform. To fund domain hosting, server infrastructure, ongoing browser engine maintenance, and open-source contributions without charging subscriptions or placing paywalls on everyday tools, our website may display clearly labeled sponsored links, affiliate resources, or partner recommendations (including Adsterra Smartlink placements).
        </p>

        <h2 className="text-base font-bold text-slate-900">Our Strict Advertising Integrity Principles</h2>
        <div className="space-y-3">
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">1. No Deceptive Download Buttons</h3>
            <p className="text-xs text-slate-600 mt-1">
              We strictly prohibit fake "Download Now", "Start", or "Install" buttons that masquerade as document output controls. Your generated PDF is always downloaded via a prominent, distinct, and verified in-app button.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">2. No Forced Interstitials or Paywalls</h3>
            <p className="text-xs text-slate-600 mt-1">
              You are never forced to click an advertisement, register an account, or watch a video timer to receive your processed file. File generation is unconditional.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">3. Zero Data Sharing With Advertisers</h3>
            <p className="text-xs text-slate-600 mt-1">
              Because all document processing occurs in your browser's local JavaScript memory, advertising providers never receive document names, contents, or metadata.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">4. Clear FTC & ASA Compliance Labels</h3>
            <p className="text-xs text-slate-600 mt-1">
              All promotional or sponsored external resources are marked with explicit indicators such as "Sponsored Resource" and carry search-compliant <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">rel="sponsored"</code> tags.
            </p>
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-900">Configuration and Publisher Inquiries</h2>
        <p>
          If you encounter an advertisement or partner destination that violates ethical standards or contains objectionable content, please report the placement immediately so our team can block the respective publisher inventory category:
        </p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs text-slate-700">
          Ad Inquiries: [ADVERTISING_SUPPORT_EMAIL_PLACEHOLDER]<br />
          Platform: PDF Quick Tools Network
        </div>
      </div>
    </div>
  );
};
