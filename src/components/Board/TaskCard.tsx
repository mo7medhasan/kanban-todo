import React from 'react';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { Task } from '@/types/task.types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  handleDragStart: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void; 
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;     
  isDropTarget: boolean; 
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  handleDragStart, 
  handleDragOver,
  handleDragLeave,
  handleDrop,
  isDropTarget
}) => {
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave} 
      onDrop={handleDrop} 
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move ${
        isDropTarget ? 'ring-2 ring-blue-500' : '' 
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
        <div className="cursor-grab active:cursor-grabbing ml-2 text-gray-400 hover:text-gray-600">
          <GripVertical size={20} />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onEdit(task)}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="text-gray-600 hover:text-red-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};