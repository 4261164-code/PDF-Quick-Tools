import React from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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
    <div className="w-full my-8">
      {/* Loading State */}
      {isProcessing && (
        <div className="bg-surface-main border border-border-subtle rounded-2xl p-10 sm:p-16 shadow-xl shadow-text-primary/5 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-brand-primary blur-2xl opacity-10 animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-2xl bg-brand-primary/5 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
            </div>
          </div>
          
          <h4 className="text-xl sm:text-2xl font-black text-text-primary mb-3">
            Processing Binary Streams
          </h4>
          <p className="text-sm text-text-secondary max-w-md leading-relaxed mb-10">
            {statusMessage || 'Assembling PDF data structures locally in memory...'}
          </p>
          
          <div className="w-full max-w-sm space-y-3">
            <div className="w-full bg-surface-bg border border-border-subtle rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-brand-primary h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(180,35,50,0.4)]"
                style={{ width: `${Math.max(10, state.progress)}%` }}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary animate-pulse">Running</span>
              <span className="text-xs font-mono font-bold text-text-primary tabular-nums">
                {Math.round(state.progress)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isProcessing && (
        <div className="bg-red-50/50 border-2 border-red-100 rounded-2xl p-10 sm:p-16 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-black text-red-900 mb-2">Operation Failed</h4>
          <p className="text-sm text-red-800/70 max-w-md mx-auto mb-10 leading-relaxed font-medium">
            {error}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="h-12 px-8 inline-flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 rounded-full transition-all active:scale-95 shadow-lg shadow-red-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Success State */}
      {resultUrl && !isProcessing && (
        <div className="bg-surface-main border-2 border-emerald-100 rounded-3xl p-10 sm:p-16 shadow-2xl shadow-emerald-500/10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20"></div>
            <div className="relative w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
          </div>

          <h4 className="text-2xl sm:text-3xl font-black text-text-primary mb-3">
            Task Completed
          </h4>
          <p className="text-sm sm:text-base text-text-secondary max-w-md mb-10 leading-relaxed">
            Your optimized file is ready. All binary data was processed locally and will be cleared once you leave.
          </p>

          {/* Size analysis */}
          {originalSize !== undefined && resultSize !== undefined && (
            <div className="mb-12 w-full max-w-md bg-surface-bg border border-border-subtle rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.15em] text-text-secondary/60">
                <span>Original File</span>
                <span className="font-mono text-text-primary text-xs">{formatBytes(originalSize)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.15em] text-text-secondary/60">
                <span>Output File</span>
                <span className="font-mono text-text-primary text-xs">{formatBytes(resultSize)}</span>
              </div>
              
              <div className="pt-4 border-t border-border-subtle/50 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-text-primary">Net Result</span>
                <div className="flex flex-col items-end">
                  {resultSize < originalSize ? (
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono text-sm font-black text-emerald-600">
                        -{Math.round(((originalSize - resultSize) / originalSize) * 100)}%
                      </span>
                    </div>
                  ) : resultSize === originalSize ? (
                    <span className="font-mono text-sm font-bold text-text-secondary/50">No change</span>
                  ) : (
                    <span className="font-mono text-sm font-bold text-amber-600">Dense Original</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <a
              href={resultUrl}
              download={resultFilename || 'processed.pdf'}
              onClick={handleDownload}
              className="group relative w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-brand-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative h-14 px-10 rounded-full flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-white bg-brand-primary hover:bg-brand-hover transition-all active:scale-95 shadow-xl shadow-brand-primary/20">
                <Download className="w-5 h-5" />
                <span>Save Document</span>
              </div>
            </a>

            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto h-14 px-8 text-xs font-black uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors"
            >
              Start Over
            </button>
          </div>
          
          <div className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/40">
            <ShieldCheck className="w-3 h-3" />
            <span>Encrypted local session</span>
          </div>
        </div>
      )}
    </div>
  );
};

