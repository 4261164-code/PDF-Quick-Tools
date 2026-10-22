import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

interface LegalProps {
  navigate: (path: string) => void;
}

export const TermsPage: React.FC<LegalProps> = ({ navigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-slate-900">
          Home
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Terms of Service</span>
      </nav>

      <header className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Effective Date: October 2026 · Operator: [OWNER_OR_OPERATOR_NAME_PLACEHOLDER]
        </p>
      </header>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
        <p>
          By accessing or using <strong>PDF Quick Tools</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the service immediately.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Description of Service</h2>
        <p>
          PDF Quick Tools provides free, browser-based document utilities including merging, splitting, compressing, converting images, extracting pages, and rotating PDF files. All processing occurs locally within the user's web browser environment without transmitting document data to backend servers.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Permitted and Lawful Use</h2>
        <p>
          You agree to use this platform solely for legitimate purposes. You confirm that you possess the necessary legal authority, copyright, or authorization to manipulate any files you open with the software.
        </p>

        <h2 className="text-base font-bold text-slate-900">4. Disclaimer of Warranties</h2>
        <p>
          The service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. While we strive to maintain robust file format compatibility with the ISO 32000 PDF standard, we cannot guarantee that every corrupt, non-standard, or encrypted file will process without errors.
        </p>

        <h2 className="text-base font-bold text-slate-900">5. Limitation of Liability</h2>
        <p>
          In no event shall the operators of PDF Quick Tools be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the service, including data loss or corruption. Users are advised to retain original backups of all documents prior to applying modifications.
        </p>

        <h2 className="text-base font-bold text-slate-900">6. Modifications to Service</h2>
        <p>
          We reserve the right to modify, suspend, or discontinue any feature of the platform at any time without notice.
        </p>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs text-slate-700 mt-6">
          Legal Operator: [COMPANY_OR_INDIVIDUAL_LEGAL_NAME_PLACEHOLDER]<br />
          Contact Email: [SUPPORT_EMAIL_PLACEHOLDER]<br />
          Jurisdiction: Applicable State and Federal Laws of the United States / Laws of England and Wales
        </div>
      </div>
    </div>
  );
};
