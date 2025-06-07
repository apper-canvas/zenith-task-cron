import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const TaskFormModal = ({
  showCreateForm,
  setShowCreateForm,
  newTask,
  setNewTask,
  handleCreateTask,
  titleInputRef,
}) => {
  return (
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
              <FormField>
                <Input
                  ref={titleInputRef}
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="TASK TITLE"
                  required
                />
              </FormField>
              
              <FormField>
                <Input
                  as="textarea"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="DESCRIPTION (OPTIONAL)"
                  rows={3}
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
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
                </FormField>
                
                <FormField>
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
                </FormField>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <Button
                type="submit"
                className="flex-1 py-3"
              >
                CREATE
              </Button>
              
              <Button
                type="button"
                onClick={() => setShowCreateForm(false)}
                variant="danger"
                className="px-6 py-3"
              >
                CANCEL
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;