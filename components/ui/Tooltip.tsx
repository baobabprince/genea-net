import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  theme?: 'light' | 'dark';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '', theme = 'light' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute bottom-full mb-2 w-64 p-3 ${
            theme === 'dark'
              ? 'bg-gray-950 text-gray-200 border-gray-700'
              : 'bg-[#fefefb] text-[#29392f] border-[#e7e8e0] shadow-[0_4px_18px_#29392f14]'
          } text-sm rounded-xl border z-50 text-right leading-relaxed`}
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        >
          {content}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: theme === 'dark' ? '6px solid #374151' : '6px solid #e7e8e0',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
