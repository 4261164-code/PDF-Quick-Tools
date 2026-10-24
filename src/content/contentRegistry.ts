export interface ContentRegistryItem {
  id: string;
  targetQueryCluster: string;
  intendedUrl: string;
  pagePurpose: string;
  uniqueValue: string;
  internalLinks: string[];
  publicationStatus: 'Published' | 'Draft' | 'Planned' | 'Under Review';
  qualityReviewStatus: 'Passed' | 'Pending' | 'Needs Revision';
}

export const CONTENT_REGISTRY: ContentRegistryItem[] = [
  {
    id: 'guide-merge',
    targetQueryCluster: 'how to merge pdf files online free',
    intendedUrl: '/pdf-guides/how-to-merge-pdf-files',
    pagePurpose: 'Guide users on combining multiple PDF files into one document without losing vector formatting.',
    uniqueValue: 'Step-by-step instructions with zero-upload client-side security guarantee.',
    internalLinks: ['/merge-pdf', '/compress-pdf', '/pdf-guides'],
    publicationStatus: 'Published',
    qualityReviewStatus: 'Passed',
  },
  {
    id: 'guide-compress',
    targetQueryCluster: 'reduce pdf file size online without losing quality',
    intendedUrl: '/pdf-guides/how-to-compress-a-pdf',
    pagePurpose: 'Explain lossless object stream optimization and realistic PDF compression expectations.',
    uniqueValue: 'Technical breakdown of PDF internal streams and byte reduction reporting.',
    internalLinks: ['/compress-pdf', '/merge-pdf', '/pdf-guides'],
    publicationStatus: 'Published',
    qualityReviewStatus: 'Passed',
  },
  {
    id: 'guide-split',
    targetQueryCluster: 'split pdf pages online free into separate files',
    intendedUrl: '/pdf-guides/how-to-split-a-pdf',
    pagePurpose: 'Show techniques for isolating specific chapters and exporting ZIP bundles.',
    uniqueValue: 'Batch extraction guide with instant client-side ZIP packaging.',
    internalLinks: ['/split-pdf', '/extract-pdf-pages', '/pdf-guides'],
    publicationStatus: 'Published',
    qualityReviewStatus: 'Passed',
  },
  {
    id: 'guide-images-to-pdf',
    targetQueryCluster: 'convert jpg png images to pdf online free',
    intendedUrl: '/pdf-guides/how-to-convert-images-to-pdf',
    pagePurpose: 'Instruct users on formatting multiple image files into a standardized multi-page PDF document.',
    uniqueValue: 'Orientation and margin configuration guide for scanned image documents.',
    internalLinks: ['/image-to-pdf', '/merge-pdf', '/pdf-guides'],
    publicationStatus: 'Planned',
    qualityReviewStatus: 'Pending',
  },
  {
    id: 'guide-extract-pages',
    targetQueryCluster: 'extract specific pages from pdf online',
    intendedUrl: '/pdf-guides/how-to-extract-pdf-pages',
    pagePurpose: 'Provide instructions on isolating individual pages or page ranges from large reports.',
    uniqueValue: 'Precise extraction tutorial preserving original typography and vector graphics.',
    internalLinks: ['/extract-pdf-pages', '/split-pdf', '/pdf-guides'],
    publicationStatus: 'Planned',
    qualityReviewStatus: 'Pending',
  },
  {
    id: 'guide-rotate-pdf',
    targetQueryCluster: 'rotate pdf pages permanently online',
    intendedUrl: '/pdf-guides/how-to-rotate-pdf-pages',
    pagePurpose: 'Guide users on correcting upside-down or sideways scanned PDF pages.',
    uniqueValue: 'Catalog-level rotation explanation with instant browser download.',
    internalLinks: ['/rotate-pdf', '/merge-pdf', '/pdf-guides'],
    publicationStatus: 'Planned',
    qualityReviewStatus: 'Pending',
  },
  {
    id: 'troubleshoot-encrypted',
    targetQueryCluster: 'how to unlock password protected pdf online',
    intendedUrl: '/pdf-guides/troubleshooting-encrypted-pdf-files',
    pagePurpose: 'Clarify security protocols regarding password-protected PDFs and why unlocking requires user permission.',
    uniqueValue: 'Transparent security explanation outlining browser limitations and permission requirements.',
    internalLinks: ['/privacy', '/contact', '/pdf-guides'],
    publicationStatus: 'Draft',
    qualityReviewStatus: 'Under Review',
  },
  {
    id: 'troubleshoot-large-files',
    targetQueryCluster: 'browser memory error large pdf compression',
    intendedUrl: '/pdf-guides/troubleshooting-browser-memory-large-pdf',
    pagePurpose: 'Help users troubleshoot browser memory limits when processing massive 100MB+ PDF documents.',
    uniqueValue: 'Actionable tips on browser tab allocation and hardware memory limits for client-side tools.',
    internalLinks: ['/compress-pdf', '/contact', '/pdf-guides'],
    publicationStatus: 'Draft',
    qualityReviewStatus: 'Under Review',
  },
];
