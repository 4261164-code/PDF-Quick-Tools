import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, AlertCircle, ShieldCheck } from 'lucide-react';
import { validatePdfSignature, validateImageSignature, validateFileSize } from '../../utils/fileValidation';

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
        ? 'Upload PDF documents'
        : 'Upload a PDF document'
      : 'Upload images';

  const defaultSubtitle =
    acceptType === 'pdf'
      ? `Merge, split or compress up to ${maxFiles} files simultaneously.`
      : `Select multiple JPG or PNG images to compile into a professional PDF.`;

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
      const sizeValidation = validateFileSize(file, 100 * 1024 * 1024);
      if (!sizeValidation.valid) {
        setValidationError(sizeValidation.error || 'Invalid file size.');
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

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group flex flex-col items-center justify-center p-10 sm:p-16 text-center rounded-2xl border-2 transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-brand-primary bg-brand-primary/[0.02] ring-4 ring-brand-primary/5'
            : 'border-border-subtle bg-surface-main hover:border-brand-primary/30 hover:bg-surface-bg/50'
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
          onChange={async (e) => {
            if (e.target.files && e.target.files.length > 0) {
              await processSelectedFiles(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
          tabIndex={-1}
        />

        {/* Decorative background element */}
        <div className={`absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity duration-500 ${isDragging ? 'opacity-[0.06]' : 'group-hover:opacity-[0.05]'}`}>
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(var(--color-brand-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>

        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
          isDragging 
            ? 'bg-brand-primary text-white scale-110' 
            : 'bg-surface-bg text-brand-primary group-hover:scale-105 group-hover:bg-brand-primary group-hover:text-white'
        }`}>
          {acceptType === 'pdf' ? (
            <FileText className="w-8 h-8 stroke-[1.5]" />
          ) : (
            <ImageIcon className="w-8 h-8 stroke-[1.5]" />
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-primary">
            <Upload className="w-3 h-3 stroke-[3]" />
          </div>
        </div>

        <h3 className="relative text-xl sm:text-2xl font-bold text-text-primary mb-3">
          {title || defaultTitle}
        </h3>
        <p className="relative text-sm sm:text-base text-text-secondary max-w-md mb-8 leading-relaxed">
          {subtitle || defaultSubtitle}
        </p>

        <div className="relative group/btn">
          <div className="absolute inset-0 bg-brand-primary blur-md opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
          <div className="relative min-h-[48px] inline-flex items-center justify-center gap-3 px-8 py-3 text-sm font-bold text-white bg-brand-primary hover:bg-brand-hover rounded-full transition-all shadow-lg shadow-brand-primary/20 active:scale-95 pointer-events-none">
            <span>Choose Files</span>
          </div>
        </div>

        <div className="relative mt-10 pt-8 border-t border-border-subtle/50 w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-wider font-bold text-text-secondary/60">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand-primary/40"></span>
            <span>{acceptType === 'pdf' ? 'Adobe PDF' : 'JPG · PNG · WebP'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand-primary/40"></span>
            <span>Up to 100MB</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Private Processing</span>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="mt-4 flex items-start gap-3 p-4 text-sm text-red-900 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <div className="flex flex-col gap-1">
            <span className="font-bold">Validation Error</span>
            <span className="text-red-800/80 font-medium">{validationError}</span>
          </div>
        </div>
      )}
    </div>
  );
};

