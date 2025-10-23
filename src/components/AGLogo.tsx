import React from 'react';

interface AGLogoProps {
  color?: 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTrademark?: boolean;
}

export const AGLogo: React.FC<AGLogoProps> = ({ 
  color = 'white', 
  size = 'md', 
  className = '',
  showTrademark = false
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src="https://cdn.shopify.com/s/files/1/0680/8600/6060/files/logo_430x.svg?v=1689336340" 
        alt="Archgrille Logo"
        className="w-full h-full object-contain"
        style={{
          filter: color === 'white' ? 'brightness(0) invert(1)' : 'brightness(0)'
        }}
      />
      {showTrademark && (
        <span className="text-xs font-bold ml-1">®</span>
      )}
    </div>
  );
};
