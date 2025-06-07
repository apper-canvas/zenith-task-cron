import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const AppHeader = ({ onToggleShortcuts }) => {
  return (
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
          
          <Button
            onClick={onToggleShortcuts}
            className="p-4" // Padding directly on button is fine.
          >
            <ApperIcon name="Keyboard" size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;