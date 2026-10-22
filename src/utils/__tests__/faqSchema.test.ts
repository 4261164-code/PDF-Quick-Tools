import { describe, it, expect } from 'vitest';
import type { FaqItem } from '../../components/common/FaqJsonLd';

describe('FAQ Schema JSON-LD Generator', () => {
  it('formats valid Schema.org FAQPage data', () => {
    const items: FaqItem[] = [
      {
        question: 'Does merging PDF files reduce print or text quality?',
        answer: 'No. Merging uses lossless structural copying of PDF page dictionaries.',
      },
    ];

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity.length).toBe(1);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
    expect(schema.mainEntity[0].name).toBe(items[0].question);
    expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(items[0].answer);
  });
});
