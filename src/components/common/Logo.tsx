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
      {/* Logo Image */}
      <img src="/logo.png" alt="PDF Quick Tools Logo" className={`${iconSize} shrink-0 object-contain`} />

      {showText && (
        <span className={`font-bold tracking-tight text-text-primary ${textSize} select-none leading-none`}>
          PDF Quick<span className="text-brand-primary">Tools</span>
        </span>
      )}
    </div>
  );
};
