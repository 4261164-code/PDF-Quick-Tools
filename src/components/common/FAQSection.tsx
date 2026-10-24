import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqJsonLd, FaqItem } from './FaqJsonLd';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Are my files uploaded to a remote server?',
    answer:
      'No. All PDF processing (merging, splitting, compression, conversion, extraction, and rotation) occurs 100% locally in your browser memory using advanced Web APIs. Your documents never touch a remote server or leave your device.',
  },
  {
    question: 'Is PDF Quick Tools completely free to use?',
    answer:
      'Yes, all core PDF utilities are 100% free with no hidden subscription fees, watermark restrictions, or artificial file caps.',
  },
  {
    question: 'Do I need to install software or create an account?',
    answer:
      'No installation or user account registration is required. PDF Quick Tools runs instantly inside any modern web browser on desktop, tablet, or mobile devices.',
  },
  {
    question: 'What is the maximum file size supported?',
    answer:
      'We support files up to 100 MB per document. Because processing happens locally in your browser, performance scales with your device memory and CPU.',
  },
  {
    question: 'How does PDF compression reduce file size?',
    answer:
      'Our compressor optimizes internal PDF object streams and structure using clean Deflate algorithms without degrading vector text sharpness or resolution.',
  },
  {
    question: 'Is my data secure for confidential or legal documents?',
    answer:
      'Extremely secure. Because files are never uploaded or transmitted over the internet, your confidential financial, legal, or personal documents remain strictly private on your hardware.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <FaqJsonLd items={FAQ_ITEMS} />

      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#B42332] bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          <HelpCircle className="w-3.5 h-3.5" />
          Frequently Asked Questions
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
          Everything You Need to Know
        </h2>
        <p className="text-sm sm:text-base text-[#52525B] max-w-xl mx-auto">
          Clear answers regarding our zero-upload privacy architecture, file limits, and client-side performance.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white border border-[#E4E4E7] rounded-2xl overflow-hidden transition-all shadow-2xs hover:border-slate-300"
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B42332]"
              >
                <span className="font-bold text-[#18181B] text-base sm:text-lg">
                  {item.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full bg-[#FAFAF8] border border-[#E4E4E7] flex items-center justify-center text-[#52525B] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-rose-50 text-[#B42332] border-rose-200' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-0 text-sm sm:text-base text-[#52525B] leading-relaxed border-t border-slate-100 pt-4 animate-fadeIn">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
