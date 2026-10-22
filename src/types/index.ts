export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  previewUrl?: string;
  rotation?: number;
  arrayBuffer?: ArrayBuffer;
}

export type ToolId =
  | 'merge'
  | 'split'
  | 'compress'
  | 'image-to-pdf'
  | 'extract'
  | 'rotate';

export interface ImageToPdfOptions {
  pageSize: 'a4' | 'letter' | 'fit';
  orientation: 'portrait' | 'landscape' | 'auto';
  margin: number; // in points (e.g. 0, 18, 36)
}

export interface CompressOptions {
  mode: 'lossless' | 'hybrid';
  targetDpi?: number;
  imageQuality?: number;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  statusMessage: string;
  error: string | null;
  resultBlob: Blob | null;
  resultUrl: string | null;
  resultFilename: string | null;
  originalSize?: number;
  resultSize?: number;
  pagesProcessed?: number;
}
