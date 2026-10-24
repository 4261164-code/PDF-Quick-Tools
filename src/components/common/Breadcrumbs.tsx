import React, { useEffect } from 'react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  currentPath: string;
  navigate: (path: string) => void;
}

const ROUTE_LABELS: Record<string, string> = {
  '/merge-pdf': 'Merge PDF',
  '/split-pdf': 'Split PDF',
  '/compress-pdf': 'Compress PDF',
  '/image-to-pdf': 'Image to PDF',
  '/extract-pdf-pages': 'Extract PDF Pages',
  '/rotate-pdf': 'Rotate PDF',
  '/pdf-guides': 'PDF Guides',
  '/pdf-guides/how-to-merge-pdf-files': 'How to Merge PDF Files',
  '/pdf-guides/how-to-compress-a-pdf': 'How to Compress a PDF',
  '/pdf-guides/how-to-split-a-pdf': 'How to Split a PDF',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/advertising-disclosure': 'Advertising Disclosure',
  '/contact': 'Contact & Support',
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPath, navigate }) => {
  // Do not render breadcrumbs on home page
  if (currentPath === '/') {
    return null;
  }

  // Build breadcrumb items based on path segments
  const segments = currentPath.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

  let accumulatedPath = '';
  for (const segment of segments) {
    accumulatedPath += `/${segment}`;
    const label = ROUTE_LABELS[accumulatedPath] || segment.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
    items.push({ label, path: accumulatedPath });
  }

  // Generate JSON-LD schema for breadcrumbs
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const schemaId = 'breadcrumb-jsonld-schema';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const breadcrumbListSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: `https://pdf-quick-tools.vercel.app${item.path === '/' ? '' : item.path}`,
      })),
    };

    scriptTag.text = JSON.stringify(breadcrumbListSchema);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) {
        existing.remove();
      }
    };
  }, [currentPath]);

  return (
    <nav aria-label="Breadcrumb" className="bg-[#FAFAF8] border-b border-[#E4E4E7] py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center text-xs sm:text-sm text-[#52525B]">
        <ol className="flex items-center space-x-2 flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.path} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-[#A1A1AA] select-none" aria-hidden="true">
                    /
                  </span>
                )}
                {isLast ? (
                  <span
                    className="font-medium text-[#18181B] truncate max-w-[200px] sm:max-w-xs"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(item.path)}
                    className="hover:text-[#B42332] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B42332] rounded-xs"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
