import React, { useEffect } from 'react';

interface ToolJsonLdProps {
  name: string;
  url: string;
  description: string;
  applicationSubCategory?: string;
  featureList: string[];
}

export const ToolJsonLd: React.FC<ToolJsonLdProps> = ({
  name,
  url,
  description,
  applicationSubCategory = 'PDF Utility',
  featureList,
}) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const schemaId = 'tool-jsonld-schema';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const toolSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name,
      url,
      applicationCategory: 'UtilitiesApplication',
      applicationSubCategory,
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5. Works in modern web browsers.',
      description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList,
    };

    scriptTag.text = JSON.stringify(toolSchema);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) {
        existing.remove();
      }
    };
  }, [name, url, description, applicationSubCategory, featureList]);

  return null;
};
