
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  theme?: 'light' | 'dark';
}

const Button: React.FC<ButtonProps> = ({ children, icon, variant = 'primary', theme = 'dark', ...props }) => {
  const baseStyles = `w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'
  } disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]`;
  
  const variants = {
    primary: theme === 'dark'
      ? "bg-cyan-600 text-white hover:bg-cyan-500 hover:shadow-cyan-950/45 focus:ring-cyan-500"
      : "bg-cyan-600 text-white hover:bg-cyan-700 hover:shadow-cyan-200/45 focus:ring-cyan-500",
    secondary: theme === 'dark'
      ? "bg-gray-700 text-gray-200 border border-gray-650 hover:bg-gray-600 hover:text-white focus:ring-cyan-500"
      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:text-gray-900 focus:ring-cyan-500"
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
