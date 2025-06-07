import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-heading font-bold mb-2 text-gray-200 uppercase">
          SYSTEM FAILURE
        </h3>
        <p className="text-gray-400 mb-6 font-mono">{error}</p>
        <Button
          onClick={onRetry}
          className="px-6 py-3"
        >
          RETRY OPERATION
        </Button>
      </motion.div>
    </div>
  );
};

export default ErrorMessage;