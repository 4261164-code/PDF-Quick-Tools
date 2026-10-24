import React from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

interface AdsterraPlacementProps {
  placementLocation?: 'below-tool' | 'sidebar' | 'guide-footer' | 'sidebar-sticky';
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
      className={`relative overflow-hidden p-6 sm:p-8 rounded-[2rem] bg-white border border-border-subtle shadow-xl shadow-black/[0.02] transition-all ${className}`}
      aria-label="Sponsored Content"
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-surface-main text-text-primary">
            <Info className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">
            Sponsored Resource
          </span>
        </div>
        <div className="px-2 py-0.5 rounded-full border border-border-subtle bg-surface-bg text-[9px] font-bold text-text-secondary opacity-40 uppercase tracking-widest">
          Partner
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Support our commitment to free, private PDF utilities by exploring curated software and cloud productivity tools from our verified partners.
        </p>

        <a
          href={smartlinkUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={handleClick}
          className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs text-text-primary bg-surface-main hover:bg-surface-bg border border-border-subtle transition-all group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          <span>Explore Partner Offer</span>
          <ExternalLink className="w-3.5 h-3.5 text-text-secondary group-hover:text-brand-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </a>
      </div>
    </aside>
  );
};


