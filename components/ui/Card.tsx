
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark';
}

const Card: React.FC<CardProps> = ({ children, className = '', theme = 'dark' }) => {
  const baseBg = theme === 'dark' 
    ? 'bg-gray-850 bg-opacity-70 border-gray-700/80 shadow-2xl' 
    : 'bg-white bg-opacity-95 border-gray-200/80 shadow-lg';
  return (
    <div className={`${baseBg} backdrop-blur-md rounded-lg border transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;