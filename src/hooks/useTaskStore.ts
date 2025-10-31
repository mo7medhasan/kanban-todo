import { create } from 'zustand';
import { Task } from '@/types/task.types';

type TaskUIState = {
  searchQuery: string;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingTask: Task | null;

  setSearchQuery: (query: string) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (task: Task) => void;
  closeEditModal: () => void;
};

export const useTaskStore = create<TaskUIState>((set) => ({
  searchQuery: '',
  isAddModalOpen: false,
  isEditModalOpen: false,
  editingTask: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),
  openEditModal: (task) => set({ isEditModalOpen: true, editingTask: task }),
  closeEditModal: () => set({ isEditModalOpen: false, editingTask: null }),
}));
