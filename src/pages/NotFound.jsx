import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="font-heading text-9xl font-bold text-gray-800 mb-4">
          404
        </div>
        
        <h1 className="font-heading text-3xl font-bold text-gray-200 mb-4 uppercase tracking-wider">
          VOID ENCOUNTERED
        </h1>
        
        <p className="text-gray-400 mb-8 font-mono tracking-wider">
          THE PATH YOU SEEK DOES NOT EXIST IN THIS DIMENSION
        </p>
        
        <div className="mb-8 text-gray-600 font-mono text-xs tracking-widest">
          ████████████████████████
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-secondary border-4 border-gray-600 text-gray-200 
                   font-heading font-bold uppercase tracking-wider
                   hover:bg-gray-600 transition-colors duration-100
                   shadow-brutal"
        >
          <div className="flex items-center gap-3">
            <ApperIcon name="Home" size={20} />
            RETURN TO BASE
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;