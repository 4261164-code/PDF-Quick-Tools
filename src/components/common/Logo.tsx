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
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Premium Monogram Logo */}
      <div className={`${iconSize} shrink-0`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Main diamond/square shape */}
          <rect
            x="4"
            y="4"
            width="32"
            height="32"
            rx="4"
            fill="var(--color-brand-primary)"
            className="transition-colors duration-300"
          />
          {/* Stylized P monogram / sheet fold hybrid */}
          <path
            d="M12 12H24C26.2091 12 28 13.7909 28 16C28 18.2091 26.2091 20 24 20H12V28"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 20H20"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-bold tracking-tight text-text-primary ${textSize} select-none leading-none`}>
          PDF Quick<span className="text-brand-primary">Tools</span>
        </span>
      )}
    </div>
  );
};
