import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// ApperIcon is not strictly needed for this modal, as per the original Home.jsx
// ApperIcon from '@/components/ApperIcon';

const KeyboardShortcutsModal = ({ showShortcuts, onClose, shortcuts }) => {
  return (
    <AnimatePresence>
      {showShortcuts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={onClose}
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
  );
};

export default KeyboardShortcutsModal;