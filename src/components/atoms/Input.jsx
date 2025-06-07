import React from 'react';

const Input = ({ as = 'input', className, ...props }) => {
  const commonClasses = `w-full px-4 py-3 bg-secondary border-4 border-gray-600 text-gray-200 
                         placeholder-gray-500 font-mono tracking-wider uppercase text-sm
                         focus:border-gray-500 transition-colors duration-100`;

  if (as === 'textarea') {
    return (
      <textarea
        className={`${commonClasses} resize-none ${className || ''}`}
        {...props}
      />
    );
  }

  // Default to input
  return (
    <input
      className={`${commonClasses} ${className || ''}`}
      {...props}
    />
  );
};

export default Input;