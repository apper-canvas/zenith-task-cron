import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';

const Home = () => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '?') {
        event.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
      if (event.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts]);

  const shortcuts = [
    { key: 'N', description: 'NEW TASK' },
    { key: 'F', description: 'FOCUS MODE' },
    { key: '/', description: 'SEARCH' },
    { key: '?', description: 'SHORTCUTS' },
    { key: 'ESC', description: 'CLOSE/EXIT' }
  ];

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <div className="border-b-4 border-gray-800 bg-primary concrete-texture">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-6xl font-bold text-gray-200 tracking-tighter uppercase">
                ZENITH
              </h1>
              <div className="mt-2 text-gray-400 font-mono text-sm tracking-widest">
                ████████████████████████
              </div>
            </div>
            
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="p-4 bg-secondary border-4 border-gray-600 text-gray-200 
                       hover:bg-gray-600 transition-colors duration-100"
            >
              <ApperIcon name="Keyboard" size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <MainFeature />

      {/* Keyboard Shortcuts Overlay */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-primary border-4 border-gray-600 p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-heading text-2xl font-bold mb-6 text-gray-200 uppercase tracking-wider">
                KEYBOARD SHORTCUTS
              </h2>
              
              <div className="space-y-3">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between">
                    <span className="bg-secondary border-2 border-gray-600 px-3 py-1 font-mono text-sm">
                      {shortcut.key}
                    </span>
                    <span className="text-gray-300 font-mono text-sm tracking-wider">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <div className="text-gray-500 font-mono text-xs tracking-widest">
                  ████████████████████████
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;