import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskCard = ({
  task,
  onComplete,
  onDelete,
  onDragStart,
  isInFocus,
  isDimmed,
  getPriorityColor,
  index, // For staggered animation
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: isDimmed ? 0.3 : 1, 
        x: 0,
        scale: isInFocus ? 1.02 : 1
      }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className={`p-4 border-4 cursor-move transition-all duration-200 ${
        task.status === 'done' 
          ? 'bg-gray-800/50 border-gray-700' 
          : getPriorityColor(task.priority)
      } ${isInFocus ? 'shadow-brutal' : ''}`}
    >
      <div className="flex items-start gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onComplete(task.id)}
          className={`mt-1 w-5 h-5 border-2 flex items-center justify-center
                     transition-colors duration-100 ${
            task.status === 'done' 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-500 hover:border-gray-400'
          }`}
        >
          {task.status === 'done' && (
            <ApperIcon name="Check" size={12} className="text-white" />
          )}
        </motion.button>
        
        <div className="flex-1">
          <h3 className={`font-heading font-medium text-gray-200 mb-1 ${
            task.status === 'done' ? 'line-through opacity-60' : ''
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm text-gray-400 mb-2 ${
              task.status === 'done' ? 'line-through opacity-60' : ''
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
            <span className="uppercase">{task.priority}</span>
            <span>•</span>
            <span>{format(new Date(task.createdAt), 'MMM dd')}</span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(task.id)}
          className="text-gray-500 hover:text-accent transition-colors duration-100"
        >
          <ApperIcon name="Trash2" size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskCard;