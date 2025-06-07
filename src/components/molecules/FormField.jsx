import React from 'react';

const FormField = ({ children, className }) => {
  // This molecule wraps an input, textarea, or select element.
  // In the original MainFeature, each form control was typically wrapped in a <div>.
  // This FormField component replaces that div for consistency.
  // It can be extended to include labels, error messages, etc., if needed in the future.
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default FormField;