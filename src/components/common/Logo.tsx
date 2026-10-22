import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Custom Geometric PDF Emblem */}
      <div className={`relative ${iconSize} shrink-0`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xs"
          aria-hidden="true"
        >
          {/* Back sheet shadow/layer */}
          <rect
            x="8"
            y="4"
            width="22"
            height="28"
            rx="3.5"
            className="fill-slate-200"
          />
          {/* Front sheet with custom fold */}
          <path
            d="M5 6C5 4.34315 6.34315 3 8 3H21L29 11V30C29 31.6569 27.6569 33 26 33H8C6.34315 33 5 31.6569 5 30V6Z"
            className="fill-red-600"
          />
          {/* Top-right corner fold */}
          <path
            d="M21 3L29 11H23C21.8954 11 21 10.1046 21 9V3Z"
            className="fill-red-700/80"
          />
          {/* Clean minimal lightning/quick indicator inside sheet */}
          <path
            d="M16 13L12 19H17L15 25L21 17H16.5L18 13H16Z"
            className="fill-white"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-bold tracking-tight text-slate-900 ${textSize} select-none`}>
          PDF Quick<span className="text-red-600">Tools</span>
        </span>
      )}
    </div>
  );
};
