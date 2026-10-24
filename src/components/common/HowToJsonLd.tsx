import React, { useEffect } from 'react';

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

interface HowToJsonLdProps {
  name: string;
  description: string;
  steps: HowToStep[];
}

export const HowToJsonLd: React.FC<HowToJsonLdProps> = ({ name, description, steps }) => {
  useEffect(() => {
    if (typeof document === 'undefined' || steps.length === 0) return;

    const schemaId = 'howto-jsonld-schema';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name,
      description,
      step: steps.map((s, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: s.name,
        text: s.text,
        url: s.url,
      })),
    };

    scriptTag.text = JSON.stringify(howToSchema);

    return () => {
      const existing = document.getElementById(schemaId);
      if (existing) {
        existing.remove();
      }
    };
  }, [name, description, steps]);

  return null;
};
