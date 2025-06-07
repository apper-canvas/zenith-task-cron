import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className, variant = 'primary', type = 'button', ...props }) => {
    let baseClasses = `px-4 py-3 border-4 font-heading font-bold uppercase tracking-wider
                       transition-colors duration-100`;
    
    // Determine variant classes
    switch (variant) {
        case 'primary':
            baseClasses += ` bg-secondary border-gray-600 text-gray-200 hover:bg-gray-600`;
            break;
        case 'accent': // For focus mode active button
            baseClasses += ` bg-accent border-accent text-white`;
            break;
        case 'danger': // For cancel button
            baseClasses += ` bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700`;
            break;
        // Add more variants if needed
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            type={type}
            className={`${baseClasses} ${className || ''}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;