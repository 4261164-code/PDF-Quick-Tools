import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { validatePdfSignature, validateImageSignature, formatBytes } from '../../utils/fileValidation';

interface FileDropzoneProps {
  acceptType: 'pdf' | 'image';
  multiple?: boolean;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  acceptType,
  multiple = true,
  maxFiles = 20,
  onFilesSelected,
  title,
  subtitle,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultTitle =
    acceptType === 'pdf'
      ? multiple
        ? 'Select or Drop PDF Files'
        : 'Select or Drop a PDF File'
      : 'Select or Drop JPG/PNG Images';

  const defaultSubtitle =
    acceptType === 'pdf'
      ? `Upload up to ${maxFiles} PDF documents (processed 100% in your browser)`
      : `Select multiple JPG or PNG images to compile into a PDF`;

  const acceptMime =
    acceptType === 'pdf' ? 'application/pdf,.pdf' : 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';

  const processSelectedFiles = async (fileList: FileList | File[]) => {
    setValidationError(null);
    const rawFiles = Array.from(fileList);

    if (rawFiles.length === 0) return;

    if (!multiple && rawFiles.length > 1) {
      setValidationError('Please select only one file for this operation.');
      return;
    }

    if (rawFiles.length > maxFiles) {
      setValidationError(`Maximum ${maxFiles} files allowed at once.`);
      return;
    }

    const validFiles: File[] = [];

    for (const file of rawFiles) {
      // Check file size limit (100 MB per file)
      if (file.size > 100 * 1024 * 1024) {
        setValidationError(`"${file.name}" is larger than 100MB (${formatBytes(file.size)}). Large files may exceed browser memory.`);
        return;
      }

      if (acceptType === 'pdf') {
        const isPdf = await validatePdfSignature(file);
        if (!isPdf && !file.name.toLowerCase().endsWith('.pdf')) {
          setValidationError(`"${file.name}" does not appear to be a valid PDF document.`);
          return;
        }
        validFiles.push(file);
      } else {
        const imgType = await validateImageSignature(file);
        const nameLower = file.name.toLowerCase();
        const isSupportedExt = nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg') || nameLower.endsWith('.png');
        if (!imgType && !isSupportedExt) {
          setValidationError(`"${file.name}" is not a recognized JPG or PNG image.`);
          return;
        }
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processSelectedFiles(e.target.files);
      // Reset input value so same files can be re-selected if deleted
      e.target.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          isDragging
            ? 'border-red-500 bg-red-50/50 scale-[0.99]'
            : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50 shadow-2xs'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload files dropzone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptMime}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          tabIndex={-1}
        />

        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 shadow-2xs">
          {acceptType === 'pdf' ? (
            <FileText className="w-6 h-6 stroke-[1.8]" />
          ) : (
            <ImageIcon className="w-6 h-6 stroke-[1.8]" />
          )}
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
          {title || defaultTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-4 leading-relaxed">
          {subtitle || defaultSubtitle}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors pointer-events-none">
          <Upload className="w-3.5 h-3.5" />
          <span>Browse Device Files</span>
        </div>

        <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
          <span>{acceptType === 'pdf' ? 'PDF (v1.0 - 2.0)' : 'JPG, PNG, WebP'}</span>
          <span aria-hidden="true">·</span>
          <span>Max 100MB per file</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-700 font-medium">100% Client-Side</span>
        </div>
      </div>

      {validationError && (
        <div className="mt-3 flex items-start gap-2 p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
