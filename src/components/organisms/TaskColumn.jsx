import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ColumnHeader from '@/components/molecules/ColumnHeader';
import TaskCard from '@/components/molecules/TaskCard';

const TaskColumn = ({
  column,
  tasks,
  focusMode,
  currentFocusTaskId,
  onCompleteTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  getPriorityColor,
}) => {
  const columnTasks = tasks.filter(task => task.column === column.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-primary border-4 border-gray-800 p-6 concrete-texture min-h-96"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <ColumnHeader 
        icon={column.icon} 
        title={column.title} 
        taskCount={columnTasks.filter(t => t.status === 'todo').length} 
      />
      
      <div className="space-y-4">
        <AnimatePresence>
          {columnTasks.map((task, index) => {
            const isInFocus = focusMode && currentFocusTaskId === task.id;
            const isDimmed = focusMode && currentFocusTaskId !== task.id && task.status === 'todo';
            
            return (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                onDelete={onDeleteTask}
                onDragStart={onDragStart}
                isInFocus={isInFocus}
                isDimmed={isDimmed}
                getPriorityColor={getPriorityColor}
                index={index}
              />
            );
          })}
        </AnimatePresence>
        
        {columnTasks.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <div className="font-mono text-xs tracking-widest mb-2">
              ████████████
            </div>
            <p className="font-mono text-sm uppercase tracking-wider">
              NO TASKS
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskColumn;