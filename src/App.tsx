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

  // Sync document title and meta description dynamically
  useEffect(() => {
    const meta = ROUTE_META[currentPath] || ROUTE_META['/'];
    document.title = meta.title;

    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', meta.description);
    }

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', meta.title);
    }

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', meta.description);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && typeof window !== 'undefined') {
      canonical.setAttribute('href', `${window.location.origin}${currentPath}`);
    }
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
        return <HomePage navigate={navigate} />;
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
