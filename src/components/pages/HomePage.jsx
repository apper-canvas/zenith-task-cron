import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import * as taskService from '@/services/api/taskService';

import AppHeader from '@/components/organisms/AppHeader';
import KeyboardShortcutsModal from '@/components/organisms/KeyboardShortcutsModal';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import ErrorMessage from '@/components/organisms/ErrorMessage';
import TaskControls from '@/components/organisms/TaskControls';
import TaskColumn from '@/components/organisms/TaskColumn';
import ApperIcon from '@/components/ApperIcon'; // Used by AppHeader and TaskControls, but included here for completeness of context.

const HomePage = () => {
  // State from Home.jsx
  const [showShortcuts, setShowShortcuts] = useState(false);

  // State from MainFeature.jsx
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

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    column: 'today'
  });

  // Keyboard shortcuts (combined from Home.jsx and MainFeature.jsx)
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent shortcut interference when typing in input/textarea
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        return;
      }

      switch (event.key.toLowerCase()) {
        case '?':
          event.preventDefault();
          setShowShortcuts(prev => !prev);
          break;
        case 'escape':
          setShowShortcuts(false);
          setShowCreateForm(false);
          setFocusMode(false);
          setCurrentFocusTaskId(null);
          break;
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
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts, toggleFocusMode]); // Add toggleFocusMode to dependency array

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

  // Focus title input when form opens
  useEffect(() => {
    if (showCreateForm && titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [showCreateForm]);

  const toggleFocusMode = () => {
    // Only activate focus mode if there are 'todo' tasks
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
          // Find next todo task in the current column first, then any other
          const nextTask = tasks.find(t => t.status === 'todo' && t.id !== taskId && t.column === updated.column) ||
                           tasks.find(t => t.status === 'todo' && t.id !== taskId);
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

  const shortcuts = [
    { key: 'N', description: 'NEW TASK' },
    { key: 'F', description: 'FOCUS MODE' },
    { key: '/', description: 'SEARCH' },
    { key: '?', description: 'SHORTCUTS' },
    { key: 'ESC', description: 'CLOSE/EXIT' }
  ];

  return (
    <div className="min-h-screen bg-black relative">
      <AppHeader onToggleShortcuts={() => setShowShortcuts(!showShortcuts)} />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorMessage error={error} onRetry={() => window.location.reload()} />
      ) : (
        <div className="container mx-auto px-6 py-8">
          <TaskControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchInputRef={searchInputRef}
            toggleFocusMode={toggleFocusMode}
            setShowCreateForm={setShowCreateForm}
            focusMode={focusMode}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={filteredTasks}
                focusMode={focusMode}
                currentFocusTaskId={currentFocusTaskId}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={handleDeleteTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>
        </div>
      )}

      <TaskFormModal
        showCreateForm={showCreateForm}
        setShowCreateForm={setShowCreateForm}
        newTask={newTask}
        setNewTask={setNewTask}
        handleCreateTask={handleCreateTask}
        titleInputRef={titleInputRef}
      />

      <KeyboardShortcutsModal
        showShortcuts={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        shortcuts={shortcuts}
      />

      {/* Focus Mode Overlay for dimming other tasks */}
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

export default HomePage;