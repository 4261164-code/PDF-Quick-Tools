import React, { useState } from 'react';
import { Mail, CheckCircle2, Download, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { trackEvent } from '../../utils/analytics';

interface LeadCaptureProps {
  variant?: 'inline' | 'card' | 'footer-banner';
  className?: string;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({
  variant = 'card',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const generateCheatSheetPdf = async (): Promise<Uint8Array> => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595.28, 841.89]); // A4
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    // Header banner
    page.drawRectangle({
      x: 0,
      y: 740,
      width: 595.28,
      height: 101.89,
      color: rgb(0.86, 0.15, 0.15), // Red 600
    });

    page.drawText('PDF QUICK TOOLS', {
      x: 40,
      y: 795,
      size: 14,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('Document Security & Optimization Cheat Sheet', {
      x: 40,
      y: 765,
      size: 20,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    // Content sections
    let yPos = 690;

    const sections = [
      {
        title: '1. Zero-Upload Privacy Rules',
        items: [
          '• Never upload confidential financial, medical, or legal documents to unverified cloud servers.',
          '• Verify that tools execute client-side via JavaScript/WebAssembly memory without network calls.',
          '• Always remove metadata tags and authoring revision logs before public distribution.',
        ],
      },
      {
        title: '2. PDF Compression Optimization Secrets',
        items: [
          '• Convert older PDF 1.4 objects to modern PDF 1.5+ Deflate object streams.',
          '• Scanned text at 300 DPI is ideal for OCR; 150 DPI is optimal for email attachments.',
          '• Strip unused embedded color profiles (ICC profiles) and thumbnail previews.',
        ],
      },
      {
        title: '3. Document Organization & Merging Standards',
        items: [
          '• Standardize document page rotations before merging (90, 180, or 270 degrees).',
          '• Ensure form field names do not conflict when merging multiple fillable templates.',
          '• Bookmark main document sections for quick navigation in desktop PDF readers.',
        ],
      },
      {
        title: '4. Format Compatibility Matrix',
        items: [
          '• ISO 32000-1 (PDF 1.7) and ISO 32000-2 (PDF 2.0) are universal across macOS, iOS, Windows, Android.',
          '• JPG photos maintain highest compression ratio; PNGs preserve clean vector line art.',
        ],
      },
    ];

    for (const sec of sections) {
      page.drawText(sec.title, {
        x: 40,
        y: yPos,
        size: 13,
        font: fontBold,
        color: rgb(0.06, 0.09, 0.16),
      });
      yPos -= 22;

      for (const item of sec.items) {
        page.drawText(item, {
          x: 48,
          y: yPos,
          size: 10,
          font: font,
          color: rgb(0.2, 0.25, 0.33),
        });
        yPos -= 18;
      }
      yPos -= 14;
    }

    // Footer
    page.drawLine({
      start: { x: 40, y: 80 },
      end: { x: 555, y: 80 },
      thickness: 1,
      color: rgb(0.88, 0.9, 0.94),
    });

    page.drawText('PDF Quick Tools · https://pdfquicktools.com · 100% Free Client-Side Utilities', {
      x: 40,
      y: 60,
      size: 9,
      font: font,
      color: rgb(0.4, 0.45, 0.55),
    });

    return await doc.save();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);

    try {
      // Store subscriber in session / local storage
      const existing = JSON.parse(localStorage.getItem('pqt_subscribers') || '[]');
      existing.push({ email, timestamp: Date.now() });
      localStorage.setItem('pqt_subscribers', JSON.stringify(existing));

      // Generate the promised PDF cheat sheet directly in memory!
      const pdfBytes = await generateCheatSheetPdf();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      setIsSuccess(true);
      trackEvent('processing_succeeded', { tool: 'lead_capture' });
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up object URL on unmount to prevent leaks
  React.useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs ${className}`}
    >
      <div className="max-w-xl mx-auto text-center">
        {!isSuccess ? (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-50 text-red-700 text-xs font-semibold mb-4 border border-red-200">
              <FileText className="w-3.5 h-3.5 text-red-700" />
              <span>Free Download</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Get the Free PDF Security & Optimization Cheat Sheet
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Master lossless compression, redaction safety rules, and confidential document handling. Delivered as an instant PDF download.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-hidden transition-all shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[44px] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-red-700 hover:bg-red-800 active:bg-red-900 disabled:opacity-50 rounded-lg shadow-2xs transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              >
                {isSubmitting ? (
                  <span>Generating PDF...</span>
                ) : (
                  <>
                    <span>Get Free Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>No spam. 100% free. Instant PDF download.</span>
            </div>
          </>
        ) : (
          <div className="py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">Your Guide is Ready!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Thank you for subscribing. Your PDF Security & Optimization Cheat Sheet has been generated in memory.
              </p>
            </div>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="PDF_Quick_Tools_Security_Cheat_Sheet.pdf"
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-2xs transition-all focus-visible:outline-2 focus-visible:outline-red-700"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Guide</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
