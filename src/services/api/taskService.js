import mockTasks from '../mockData/tasks.json';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for tasks
let tasks = [...mockTasks];

export const getAll = async () => {
  await delay(300);
  return [...tasks];
};

export const getById = async (id) => {
  await delay(200);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    throw new Error('Task not found');
  }
  return { ...task };
};

export const create = async (taskData) => {
  await delay(400);
  const newTask = {
    id: Date.now().toString(),
    ...taskData,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  tasks.push(newTask);
  return { ...newTask };
};

export const update = async (id, updates) => {
  await delay(350);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  tasks[index] = {
    ...tasks[index],
    ...updates
  };
  
  return { ...tasks[index] };
};

export const delete_ = async (id) => {
  await delay(300);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  const deleted = tasks[index];
  tasks = tasks.filter(t => t.id !== id);
  return { ...deleted };
};

// Alias for delete (reserved keyword)
export { delete_ as delete };