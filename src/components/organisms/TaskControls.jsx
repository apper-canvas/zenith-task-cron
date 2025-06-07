import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const TaskControls = ({
  searchQuery,
  setSearchQuery,
  searchInputRef,
  toggleFocusMode,
  setShowCreateForm,
  focusMode,
}) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH TASKS..."
        />
        <ApperIcon name="Search" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
      </div>
      
      <div className="flex gap-3">
        <Button
          onClick={toggleFocusMode}
          variant={focusMode ? 'accent' : 'primary'}
        >
          <div className="flex items-center gap-2">
            <ApperIcon name="Eye" size={20} />
            FOCUS
          </div>
        </Button>
        
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
        >
          <div className="flex items-center gap-2">
            <ApperIcon name="Plus" size={20} />
            NEW
          </div>
        </Button>
      </div>
    </div>
  );
};

export default TaskControls;