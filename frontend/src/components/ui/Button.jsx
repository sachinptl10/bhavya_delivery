import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', isLoading = false, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition-all duration-200 focus:outline-none';
  const variants = {
    primary: 'bg-[var(--color-accent)] text-white hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-[var(--color-primary)] text-white hover:shadow-lg hover:-translate-y-0.5',
    outline: 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${baseClasses} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
};
