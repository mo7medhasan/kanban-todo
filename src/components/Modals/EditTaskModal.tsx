"use client";
import React, { useState} from "react";
import { Modal } from "./Modal";
import { ColumnId, Task, TaskFormData } from "@/types/task.types";
import { COLUMNS } from "@/utils/constants";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  task: Task | null;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  task,
}) => {
const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || "",
    description: task?.description || "",
    column: task?.column || "backlog",
    id: task?.id || "",
    order: task?.order || 0,
  });




  const handleSubmit = () => {
    if (task && formData.title.trim()) {
      onEdit(task.id, formData);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Column
          </label>
          <select
            value={formData.column}
            onChange={(e) =>
              setFormData({ ...formData, column: e.target.value as ColumnId })
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
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
