import React from 'react';

const Input = React.forwardRef(({ as = 'input', className, ...props }, ref) => {
  const commonClasses = `w-full px-4 py-3 bg-secondary border-4 border-gray-600 text-gray-200 
                         placeholder-gray-500 font-mono tracking-wider uppercase text-sm
                         focus:border-gray-500 transition-colors duration-100`;

  if (as === 'textarea') {
    return (
      <textarea
        ref={ref}
        className={`${commonClasses} resize-none ${className || ''}`}
        {...props}
      />
    );
  }

  // Default to input
  return (
    <input
      ref={ref}
      className={`${commonClasses} ${className || ''}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;