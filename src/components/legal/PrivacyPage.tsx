import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

interface LegalProps {
  navigate: (path: string) => void;
}

export const PrivacyPage: React.FC<LegalProps> = ({ navigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-slate-900">
          Home
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Privacy Policy</span>
      </nav>

      <header className="mb-8 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero-Upload Guarantee</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Effective Date: October 2026 · Operator: [OWNER_OR_OPERATOR_NAME_PLACEHOLDER]
        </p>
      </header>

      {/* Summary Box */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl mb-8 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Executive Summary (Plain English)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <ServerOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Your files never leave your device:</strong> We do not upload, transmit, store, or view the contents of any PDF or image you process.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <EyeOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">No account required:</strong> We do not ask for email addresses, passwords, credit card numbers, or personal identifying tokens.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900">1. Architectural Privacy by Design</h2>
        <p>
          Unlike legacy web services that require transmitting files to a backend cloud storage cluster, <strong>PDF Quick Tools</strong> operates entirely as a browser-side client application. Processing is executed in your web browser's isolated JavaScript sandbox via client libraries (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">pdf-lib</code> and <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">JSZip</code>).
        </p>
        <p>
          We operate no file storage servers, no document queues, and no databases for user content. When you close or refresh your browser tab, all temporary in-memory objects created during your session are immediately reclaimed by your operating system.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Data We Do NOT Collect</h2>
        <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
          <li>We do NOT collect, inspect, or log document file contents.</li>
          <li>We do NOT collect, inspect, or log filenames or internal PDF metadata.</li>
          <li>We do NOT collect biometric or government identification records.</li>
          <li>We do NOT store IP addresses linked to specific document operations.</li>
        </ul>

        <h2 className="text-base font-bold text-slate-900">3. Anonymous Aggregate Analytics</h2>
        <p>
          To diagnose broken browser features and measure platform performance, we record minimal, strictly anonymized aggregate usage counts (e.g. "Merge tool opened", "Processing succeeded", "Processing error"). These telemetry signals never contain user identity tokens, file names, or document sizes.
        </p>

        <h2 className="text-base font-bold text-slate-900">4. Third-Party Advertising & Smartlink Policy</h2>
        <p>
          Our platform may feature clearly labeled external partner links or compliant advertising resources (such as Adsterra Smartlinks). These links are only activated when explicitly configured by the site operator, are marked with <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">rel="sponsored"</code>, and never masquerade as file downloads. We never pass your document contents or file data to advertisers.
        </p>

        <h2 className="text-base font-bold text-slate-900">5. Contact and Inquiries</h2>
        <p>
          For privacy inquiries or technical clarification regarding our zero-upload architecture, contact:
        </p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs text-slate-700">
          Operator Contact: [PRIVACY_OFFICER_EMAIL_PLACEHOLDER]<br />
          Organization: [ORGANIZATION_NAME_PLACEHOLDER]<br />
          Jurisdiction: United States & United Kingdom
        </div>

        <p className="text-[11px] text-slate-400 mt-6 pt-4 border-t border-slate-200">
          Disclaimer: This privacy policy provides transparent disclosure of application data flows and does not constitute formal legal counsel. Owners should review terms with qualified legal representation.
        </p>
      </div>
    </div>
  );
};
