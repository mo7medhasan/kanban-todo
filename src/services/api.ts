
import axios from 'axios';
import { Task, TaskFormData } from '@/types/task.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  // Get tasks with pagination
  getTasksPaginated: async (page: number = 1, limit: number = 10): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks', {
      params: {
        _page: page,
        _limit: limit,
      },
    });
    return response.data;
  },

  // Get tasks by column
  getTasksByColumn: async (column: string): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks', {
      params: {
        column,
      },
    });
    return response.data;
  },

  // Search tasks
  searchTasks: async (query: string): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks', {
      params: {
        q: query,
      },
    });
    return response.data;
  },

  // Get single task
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData: TaskFormData): Promise<Task> => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, updates);
    return response.data;
  },
  updateTaskOrder: async (column: string, taskIds: string[]): Promise<void> => {

  const updatePromises = taskIds.map((id, index) =>
    api.patch(`/tasks/${id}`, { order: index, column }) // Send order and ensure column is correct
  );
  await Promise.all(updatePromises);
},

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Move task to different column
  moveTask: async (id: string, newColumn: string): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, {
      column: newColumn,
    });
    return response.data;
  },
};
