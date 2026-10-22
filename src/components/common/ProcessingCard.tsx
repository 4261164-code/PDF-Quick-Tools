import React from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import type { ProcessingState } from '../../types';
import { formatBytes } from '../../utils/fileValidation';
import { trackEvent } from '../../utils/analytics';

interface ProcessingCardProps {
  state: ProcessingState;
  onReset: () => void;
  toolName: string;
}

export const ProcessingCard: React.FC<ProcessingCardProps> = ({ state, onReset, toolName }) => {
  const {
    isProcessing,
    statusMessage,
    error,
    resultUrl,
    resultFilename,
    originalSize,
    resultSize,
  } = state;

  if (!isProcessing && !error && !resultUrl) {
    return null;
  }

  const handleDownload = () => {
    trackEvent('output_downloaded', {
      tool: toolName,
      action: 'download_file',
    });
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs my-6">
      {/* Loading State */}
      {isProcessing && (
        <div className="flex flex-col items-center text-center py-6">
          <Loader2 className="w-9 h-9 text-red-600 animate-spin mb-4" />
          <h4 className="text-base font-semibold text-slate-900 mb-1">
            Processing in Browser Sandbox
          </h4>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-4">
            {statusMessage || 'Assembling PDF data structures...'}
          </p>
          <div className="w-full max-w-xs bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(10, state.progress)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-mono tabular-nums">
            {Math.round(state.progress)}%
          </span>
        </div>
      )}

      {/* Error State */}
      {error && !isProcessing && (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-900 mb-1">Operation Failed</h4>
          <p className="text-xs text-red-700 max-w-md bg-red-50 p-3 rounded-lg border border-red-200 mb-5 leading-relaxed">
            {error}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Success State */}
      {resultUrl && !isProcessing && (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
            Processing Completed
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
            Your document has been compiled and is ready for instant download directly from memory.
          </p>

          {/* Size analysis if available */}
          {originalSize !== undefined && resultSize !== undefined && (
            <div className="mb-6 w-full max-w-sm bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs">
              <div className="flex items-center justify-between text-slate-600 mb-1.5">
                <span>Original Size:</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {formatBytes(originalSize)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 mb-2">
                <span>New Output Size:</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {formatBytes(resultSize)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-700">Net Change:</span>
                {resultSize < originalSize ? (
                  <span className="font-semibold text-emerald-600 tabular-nums">
                    - {formatBytes(originalSize - resultSize)} (
                    {Math.round(((originalSize - resultSize) / originalSize) * 100)}% smaller)
                  </span>
                ) : resultSize === originalSize ? (
                  <span className="text-slate-500 tabular-nums">No size change</span>
                ) : (
                  <span className="font-medium text-amber-600 tabular-nums">
                    + {formatBytes(resultSize - originalSize)} (file already dense)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Download CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href={resultUrl}
              download={resultFilename || 'processed.pdf'}
              onClick={handleDownload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <Download className="w-4 h-4" />
              <span>Download {resultFilename || 'PDF'}</span>
            </a>

            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Process Another File</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
