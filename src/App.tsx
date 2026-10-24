import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { MergeTool } from './components/tools/MergeTool';
import { SplitTool } from './components/tools/SplitTool';
import { CompressTool } from './components/tools/CompressTool';
import { ImageToPdfTool } from './components/tools/ImageToPdfTool';
import { ExtractTool } from './components/tools/ExtractTool';
import { RotateTool } from './components/tools/RotateTool';
import { GuidesIndex } from './components/guides/GuidesIndex';
import { MergeGuide } from './components/guides/MergeGuide';
import { CompressGuide } from './components/guides/CompressGuide';
import { SplitGuide } from './components/guides/SplitGuide';
import { PrivacyPage } from './components/legal/PrivacyPage';
import { TermsPage } from './components/legal/TermsPage';
import { AdvertisingDisclosurePage } from './components/legal/AdvertisingDisclosurePage';
import { ContactPage } from './components/legal/ContactPage';
import { trackEvent } from './utils/analytics';

const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Free PDF Tools Online | PDF Quick Tools',
    description: 'Merge, split, compress, convert images, extract pages, and rotate PDF files online free. 100% private in-browser processing with zero server uploads.',
  },
  '/merge-pdf': {
    title: 'Merge PDF Files Online Free | PDF Quick Tools',
    description: 'Combine multiple PDF files into one clean document with drag-and-drop reordering. Fast, secure, and private browser processing.',
  },
  '/split-pdf': {
    title: 'Split PDF Pages Online Free | PDF Quick Tools',
    description: 'Split PDF documents by custom page ranges or separate every page. Download individual PDFs or an instant ZIP bundle.',
  },
  '/compress-pdf': {
    title: 'Compress PDF Files Online | PDF Quick Tools',
    description: 'Optimize and reduce PDF file size using clean structural Deflate streams with honest byte savings reporting.',
  },
  '/image-to-pdf': {
    title: 'Convert Images to PDF Online Free | PDF Quick Tools',
    description: 'Convert JPG, JPEG, and PNG images into a clean, standardized PDF with custom margins and orientation.',
  },
  '/extract-pdf-pages': {
    title: 'Extract PDF Pages Online Free | PDF Quick Tools',
    description: 'Extract specific page numbers or custom chapters from any PDF without losing formatting or vector quality.',
  },
  '/rotate-pdf': {
    title: 'Rotate PDF Pages Online Free | PDF Quick Tools',
    description: 'Permanently rotate upside-down or sideways pages clockwise by 90, 180, or 270 degrees in the document catalog.',
  },
  '/pdf-guides': {
    title: 'PDF Guides & Document Tutorials | PDF Quick Tools',
    description: 'Step-by-step guides and technical documentation on merging, compressing, and splitting PDF documents.',
  },
  '/pdf-guides/how-to-merge-pdf-files': {
    title: 'How to Merge PDF Files Step-by-Step | PDF Quick Tools',
    description: 'Learn how to combine multiple PDF files into one unified document without losing vector sharpness or metadata.',
  },
  '/pdf-guides/how-to-compress-a-pdf': {
    title: 'How to Compress a PDF: The Complete Guide | PDF Quick Tools',
    description: 'Understand the truth about PDF compression, lossless object streams, and when image downsampling is required.',
  },
  '/pdf-guides/how-to-split-a-pdf': {
    title: 'How to Split a PDF: Custom Ranges & ZIP Archives | PDF Quick Tools',
    description: 'Techniques for isolating specific chapters, removing confidential pages, and batch exporting split documents.',
  },
  '/privacy': {
    title: 'Privacy Policy & Zero-Upload Guarantee | PDF Quick Tools',
    description: 'Transparent disclosure of our browser-side zero-upload architecture. Your files never touch a remote server.',
  },
  '/terms': {
    title: 'Terms of Service | PDF Quick Tools',
    description: 'Terms and conditions governing the use of free browser-based PDF Quick Tools utilities.',
  },
  '/advertising-disclosure': {
    title: 'Advertising & Monetization Disclosure | PDF Quick Tools',
    description: 'Compliance disclosure regarding transparent advertising resources, Adsterra partner links, and user safety standards.',
  },
  '/contact': {
    title: 'Contact & Technical Feedback | PDF Quick Tools',
    description: 'Get in touch with the PDF Quick Tools engineering team for bug reports, compatibility feedback, and inquiries.',
  },
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return ROUTE_META[path] ? path : '/';
    }
    return '/';
  });

  const navigate = (path: string) => {
    if (path !== currentPath) {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', path);
      }
      setCurrentPath(path);
      trackEvent('tool_view', { tool: path });
    }
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(ROUTE_META[path] ? path : '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Production domain for canonical links and structured data
  const PRODUCTION_DOMAIN = 'https://pdf-quick-tools.vercel.app';

  // Sync document title, meta description, canonical URL, OG tags, and robots indexation dynamically
  useEffect(() => {
    const isKnownRoute = Boolean(ROUTE_META[currentPath]);
    const meta = ROUTE_META[currentPath] || {
      title: 'Page Not Found | PDF Quick Tools',
      description: 'The requested PDF tool or guide page could not be found. Explore our free browser-based PDF utilities.',
    };

    document.title = meta.title;

    // Meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', meta.description);

    // OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', meta.title);
    }
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', meta.description);
    }

    // Twitter Card Tags
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) {
      twTitle.setAttribute('content', meta.title);
    }
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) {
      twDesc.setAttribute('content', meta.description);
    }

    // Canonical URL
    const canonicalHref = `${PRODUCTION_DOMAIN}${currentPath === '/' ? '/' : currentPath}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalHref);

    // OpenGraph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalHref);

    // Indexation controls: index valid routes, protect unknown/private routes
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', isKnownRoute ? 'index, follow' : 'noindex, nofollow');
  }, [currentPath]);

  // Route renderer
  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/merge-pdf':
        return <MergeTool navigate={navigate} />;
      case '/split-pdf':
        return <SplitTool navigate={navigate} />;
      case '/compress-pdf':
        return <CompressTool navigate={navigate} />;
      case '/image-to-pdf':
        return <ImageToPdfTool navigate={navigate} />;
      case '/extract-pdf-pages':
        return <ExtractTool navigate={navigate} />;
      case '/rotate-pdf':
        return <RotateTool navigate={navigate} />;
      case '/pdf-guides':
        return <GuidesIndex navigate={navigate} />;
      case '/pdf-guides/how-to-merge-pdf-files':
        return <MergeGuide navigate={navigate} />;
      case '/pdf-guides/how-to-compress-a-pdf':
        return <CompressGuide navigate={navigate} />;
      case '/pdf-guides/how-to-split-a-pdf':
        return <SplitGuide navigate={navigate} />;
      case '/privacy':
        return <PrivacyPage navigate={navigate} />;
      case '/terms':
        return <TermsPage navigate={navigate} />;
      case '/advertising-disclosure':
        return <AdvertisingDisclosurePage navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} />;
      default:
        return (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded border border-red-200">
              404 Error
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-4 mb-2">
              Page Not Found
            </h1>
            <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              The page or tool URL you requested does not exist or has moved. All of our free client-side PDF utilities are accessible from the homepage.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="min-h-[44px] px-6 py-2.5 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-lg shadow-2xs transition-colors inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              Return to PDF Tools Hub
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#0F172A]">
      <Header currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
