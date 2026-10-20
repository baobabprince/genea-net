import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark';
}

const Card: React.FC<CardProps> = ({ children, className = '', theme = 'light' }) => {
  const baseBg = theme === 'dark'
    ? 'bg-gray-850 bg-opacity-70 border-gray-700/80 shadow-2xl'
    : 'bg-[#fefefb] border-[#e7e8e0] shadow-[0_4px_18px_#29392f14]';
  return (
    <div className={`${baseBg} backdrop-blur-sm rounded-2xl border transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
