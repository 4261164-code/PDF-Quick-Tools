import React from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

interface AdsterraPlacementProps {
  placementLocation?: 'below-tool' | 'sidebar' | 'guide-footer';
  className?: string;
}

export const AdsterraPlacement: React.FC<AdsterraPlacementProps> = ({
  placementLocation = 'below-tool',
  className = '',
}) => {
  // Read configured Smartlink URL from Vite environment variable
  const rawUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_ADSTERRA_SMARTLINK_URL : '';

  // Validate URL format to prevent empty or invalid triggers
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (trimmed.length < 10) return false;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  if (!isValidUrl(rawUrl)) {
    // Strictly disabled when no valid URL is configured
    return null;
  }

  const smartlinkUrl = rawUrl!.trim();

  const handleClick = () => {
    trackEvent('smartlink_clicked', {
      tool: placementLocation,
      action: 'sponsored_link_opened',
    });
  };

  return (
    <aside
      className={`my-8 p-4 rounded-lg border border-slate-200 bg-slate-50/80 text-xs text-slate-600 transition-colors ${className}`}
      aria-label="Sponsored Content"
    >
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/70">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-500">Sponsored Resource</span>
        </div>
        <span className="text-[10px] text-slate-400">External Partner</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-slate-600 leading-relaxed max-w-xl">
          Support PDF Quick Tools by discovering featured cloud productivity, business software, and utility partner offers.
        </p>

        <a
          href={smartlinkUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md font-medium text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs transition-colors whitespace-nowrap shrink-0 group"
        >
          <span>Visit Partner Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </a>
      </div>
    </aside>
  );
};
