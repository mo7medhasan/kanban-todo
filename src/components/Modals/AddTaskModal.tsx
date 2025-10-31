'use client';
import React, { useState } from 'react';
import { Modal } from './Modal';
import { ColumnId, TaskFormData } from '@/types/task.types';
import { COLUMNS } from '@/utils/constants';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: TaskFormData) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    column: 'backlog',
  });

  const resetForm = () => setFormData({ title: '', description: '', column: 'backlog' });

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onAdd(formData);
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Task">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter task title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter task description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Column</label>
          <select
            value={formData.column}
            onChange={(e) =>
              setFormData({ ...formData, column: e.target.value as ColumnId})
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {COLUMNS.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Task
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
