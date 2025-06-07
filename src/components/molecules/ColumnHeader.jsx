import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const ColumnHeader = ({ icon, title, taskCount }) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <ApperIcon name={icon} size={24} className="text-gray-400" />
      <h2 className="font-heading text-xl font-bold text-gray-200 tracking-wider">
        {title}
      </h2>
      <div className="text-gray-500 font-mono text-sm">
        [{taskCount}]
      </div>
    </div>
  );
};

export default ColumnHeader;