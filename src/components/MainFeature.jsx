import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';
import * as taskService from '../services/api/taskService';

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [currentFocusTaskId, setCurrentFocusTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  
  const searchInputRef = useRef(null);
  const titleInputRef = useRef(null);

  // Form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    column: 'today'
  });

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await taskService.getAll();
        setTasks(result);
      } catch (err) {
        setError(err.message || 'Failed to load tasks');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'n':
          event.preventDefault();
          setShowCreateForm(true);
          break;
        case 'f':
          event.preventDefault();
          toggleFocusMode();
          break;
        case '/':
          event.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'escape':
          setShowCreateForm(false);
          setFocusMode(false);
          setCurrentFocusTaskId(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus title input when form opens
  useEffect(() => {
    if (showCreateForm && titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [showCreateForm]);

  const toggleFocusMode = () => {
    if (!focusMode && tasks.filter(t => t.status === 'todo').length > 0) {
      const nextTask = tasks.find(t => t.status === 'todo' && t.column === 'today') ||
                      tasks.find(t => t.status === 'todo');
      setCurrentFocusTaskId(nextTask?.id || null);
      setFocusMode(true);
      toast.success('Focus mode activated');
    } else {
      setFocusMode(false);
      setCurrentFocusTaskId(null);
      toast.success('Focus mode deactivated');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const taskData = {
        ...newTask,
        createdAt: new Date().toISOString(),
        status: 'todo',
        completedAt: null
      };
      
      const created = await taskService.create(taskData);
      setTasks(prev => [...prev, created]);
      setNewTask({ title: '', description: '', priority: 'medium', column: 'today' });
      setShowCreateForm(false);
      toast.success('Task created');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updated = await taskService.update(taskId, {
        status: task.status === 'done' ? 'todo' : 'done',
        completedAt: task.status === 'done' ? null : new Date().toISOString()
      });
      
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      
      if (updated.status === 'done') {
        toast.success('Task completed');
        if (currentFocusTaskId === taskId) {
          const nextTask = tasks.find(t => t.status === 'todo' && t.id !== taskId);
          setCurrentFocusTaskId(nextTask?.id || null);
        }
      } else {
        toast.success('Task reopened');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
      
      if (currentFocusTaskId === taskId) {
        const nextTask = tasks.find(t => t.status === 'todo' && t.id !== taskId);
        setCurrentFocusTaskId(nextTask?.id || null);
      }
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleMoveTask = async (taskId, newColumn) => {
    try {
      const updated = await taskService.update(taskId, { column: newColumn });
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      toast.success(`Task moved to ${newColumn}`);
    } catch (err) {
      toast.error('Failed to move task');
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newColumn) => {
    e.preventDefault();
    if (draggedTask && draggedTask.column !== newColumn) {
      handleMoveTask(draggedTask.id, newColumn);
    }
    setDraggedTask(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksByColumn = (column) => {
    return filteredTasks.filter(task => task.column === column);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'border-accent bg-accent/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-600 bg-gray-600/10';
    }
  };

  const columns = [
    { id: 'today', title: 'TODAY', icon: 'Clock' },
    { id: 'tomorrow', title: 'TOMORROW', icon: 'Calendar' },
    { id: 'someday', title: 'SOMEDAY', icon: 'Inbox' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-primary border-4 border-gray-800 p-6 concrete-texture"
            >
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-700 w-24"></div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-20 bg-gray-800"></div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
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
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-secondary border-4 border-gray-600 text-gray-200 
                     font-heading font-bold uppercase tracking-wider
                     hover:bg-gray-600 transition-colors duration-100"
          >
            RETRY OPERATION
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Search and Actions */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH TASKS..."
            className="w-full px-4 py-3 bg-secondary border-4 border-gray-600 text-gray-200 
                     placeholder-gray-500 font-mono tracking-wider uppercase text-sm
                     focus:border-gray-500 transition-colors duration-100"
          />
          <ApperIcon name="Search" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFocusMode}
            className={`px-4 py-3 border-4 font-heading font-bold uppercase tracking-wider
                       transition-colors duration-100 ${
              focusMode 
                ? 'bg-accent border-accent text-white' 
                : 'bg-secondary border-gray-600 text-gray-200 hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <ApperIcon name="Eye" size={20} />
              FOCUS
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-3 bg-secondary border-4 border-gray-600 text-gray-200 
                     font-heading font-bold uppercase tracking-wider
                     hover:bg-gray-600 transition-colors duration-100"
          >
            <div className="flex items-center gap-2">
              <ApperIcon name="Plus" size={20} />
              NEW
            </div>
          </motion.button>
        </div>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map((column) => {
          const columnTasks = getTasksByColumn(column.id);
          
          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary border-4 border-gray-800 p-6 concrete-texture min-h-96"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center gap-3 mb-6">
                <ApperIcon name={column.icon} size={24} className="text-gray-400" />
                <h2 className="font-heading text-xl font-bold text-gray-200 tracking-wider">
                  {column.title}
                </h2>
                <div className="text-gray-500 font-mono text-sm">
                  [{columnTasks.filter(t => t.status === 'todo').length}]
                </div>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {columnTasks.map((task, index) => {
                    const isInFocus = focusMode && currentFocusTaskId === task.id;
                    const isDimmed = focusMode && currentFocusTaskId !== task.id && task.status === 'todo';
                    
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: isDimmed ? 0.3 : 1, 
                          x: 0,
                          scale: isInFocus ? 1.02 : 1
                        }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
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
                            onClick={() => handleCompleteTask(task.id)}
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
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-gray-500 hover:text-accent transition-colors duration-100"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
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
        })}
      </div>

      {/* Create Task Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onSubmit={handleCreateTask}
              className="bg-primary border-4 border-gray-600 p-8 max-w-md w-full concrete-texture"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-heading text-2xl font-bold mb-6 text-gray-200 uppercase tracking-wider">
                CREATE TASK
              </h2>
              
              <div className="space-y-6">
                <div>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="TASK TITLE"
                    className="w-full px-4 py-3 bg-secondary border-4 border-gray-600 text-gray-200 
                             placeholder-gray-500 font-mono tracking-wider uppercase text-sm
                             focus:border-gray-500 transition-colors duration-100"
                    required
                  />
                </div>
                
                <div>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="DESCRIPTION (OPTIONAL)"
                    rows={3}
                    className="w-full px-4 py-3 bg-secondary border-4 border-gray-600 text-gray-200 
                             placeholder-gray-500 font-mono tracking-wider uppercase text-sm resize-none
                             focus:border-gray-500 transition-colors duration-100"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-3 bg-secondary border-4 border-gray-600 text-gray-200 
                               font-mono tracking-wider uppercase text-sm
                               focus:border-gray-500 transition-colors duration-100"
                    >
                      <option value="low">LOW</option>
                      <option value="medium">MEDIUM</option>
                      <option value="high">HIGH</option>
                      <option value="critical">CRITICAL</option>
                    </select>
                  </div>
                  
                  <div>
                    <select
                      value={newTask.column}
                      onChange={(e) => setNewTask(prev => ({ ...prev, column: e.target.value }))}
                      className="w-full px-4 py-3 bg-secondary border-4 border-gray-600 text-gray-200 
                               font-mono tracking-wider uppercase text-sm
                               focus:border-gray-500 transition-colors duration-100"
                    >
                      <option value="today">TODAY</option>
                      <option value="tomorrow">TOMORROW</option>
                      <option value="someday">SOMEDAY</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 py-3 bg-secondary border-4 border-gray-600 text-gray-200 
                           font-heading font-bold uppercase tracking-wider
                           hover:bg-gray-600 transition-colors duration-100"
                >
                  CREATE
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-800 border-4 border-gray-700 text-gray-400 
                           font-heading font-bold uppercase tracking-wider
                           hover:bg-gray-700 transition-colors duration-100"
                >
                  CANCEL
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {focusMode && currentFocusTaskId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;