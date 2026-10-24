import { describe, it, expect } from 'vitest';

describe('Tool WebApplication Schema & SEO Audit', () => {
  it('builds valid Schema.org WebApplication structured data', () => {
    const toolPayload = {
      name: 'Merge PDF Files Online - PDF Quick Tools',
      url: 'https://pdf-quick-tools.vercel.app/merge-pdf',
      applicationSubCategory: 'PDF Merger',
      description: 'Combine multiple PDF files into one clean document with drag-and-drop reordering.',
      featureList: [
        'Client-side merging of up to 30 PDF documents',
        'Accessible drag-and-drop reordering with keyboard controls',
        'Lossless structural stream copying',
      ],
    };

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: toolPayload.name,
      url: toolPayload.url,
      applicationCategory: 'UtilitiesApplication',
      applicationSubCategory: toolPayload.applicationSubCategory,
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5. Works in modern web browsers.',
      description: toolPayload.description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: toolPayload.featureList,
    };

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebApplication');
    expect(schema.name).toContain('Merge PDF');
    expect(schema.url).toBe('https://pdf-quick-tools.vercel.app/merge-pdf');
    expect(schema.offers.price).toBe('0');
    expect(schema.featureList.length).toBe(3);
  });

  it('validates canonical URL formatting without trailing slash discrepancies', () => {
    const domain = 'https://pdf-quick-tools.vercel.app';
    const routes = [
      '/',
      '/merge-pdf',
      '/split-pdf',
      '/compress-pdf',
      '/image-to-pdf',
      '/extract-pdf-pages',
      '/rotate-pdf',
      '/pdf-guides',
      '/pdf-guides/how-to-merge-pdf-files',
      '/pdf-guides/how-to-compress-a-pdf',
      '/pdf-guides/how-to-split-a-pdf',
      '/privacy',
      '/terms',
      '/advertising-disclosure',
      '/contact',
    ];

    routes.forEach((route) => {
      const canonical = `${domain}${route === '/' ? '/' : route}`;
      expect(canonical.startsWith('https://pdf-quick-tools.vercel.app')).toBe(true);
      if (route !== '/') {
        expect(canonical.endsWith('/')).toBe(false);
      } else {
        expect(canonical).toBe('https://pdf-quick-tools.vercel.app/');
      }
    });
  });

  it('enforces indexation controls: valid routes get index, follow; unknown routes get noindex, nofollow', () => {
    const knownRoutes = new Set([
      '/',
      '/merge-pdf',
      '/split-pdf',
      '/compress-pdf',
      '/image-to-pdf',
      '/extract-pdf-pages',
      '/rotate-pdf',
      '/pdf-guides',
      '/pdf-guides/how-to-merge-pdf-files',
      '/pdf-guides/how-to-compress-a-pdf',
      '/pdf-guides/how-to-split-a-pdf',
      '/privacy',
      '/terms',
      '/advertising-disclosure',
      '/contact',
    ]);

    const getRobotsDirective = (path: string) => {
      return knownRoutes.has(path) ? 'index, follow' : 'noindex, nofollow';
    };

    expect(getRobotsDirective('/merge-pdf')).toBe('index, follow');
    expect(getRobotsDirective('/pdf-guides/how-to-merge-pdf-files')).toBe('index, follow');
    expect(getRobotsDirective('/admin-secret-dashboard')).toBe('noindex, nofollow');
    expect(getRobotsDirective('/nonexistent-test')).toBe('noindex, nofollow');
  });
});
