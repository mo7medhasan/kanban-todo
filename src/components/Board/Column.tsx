import React from 'react';
import { TaskCard } from './TaskCard';
import { Task, ColumnId } from '@/types/task.types';
import { DraggedTaskData } from '@/hooks/useDragAndDrop';

interface ColumnProps {
  title: string;
  columnId: ColumnId;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  draggedTask: DraggedTaskData | null;
  dragOverColumn: string | null;
  dropTargetId: string | null; // Receive drop target ID
  handleDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void;
  handleDragOver: (e: React.DragEvent, columnId: string, taskId?: string) => void;
  handleDragLeave: (e: React.DragEvent, columnId: string, taskId?: string) => void;
  handleDrop: (e: React.DragEvent, targetColumnId: string, targetTaskId?: string) => void;
  handleDragEnd: () => void;
}

export const Column: React.FC<ColumnProps> = ({ 
  title, 
  columnId, 
  tasks = [], 
  onEdit, 
  onDelete,
  dragOverColumn,
  dropTargetId,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDragEnd,
}) => {
  const isOver = dragOverColumn === columnId;
  const isEmpty = tasks.length === 0;
const sortedTasks = [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div 
      className={`flex-1 min-w-72 bg-white rounded-lg shadow-md p-4 max-h-[80vh] overflow-y-auto ${
        isOver && !dropTargetId ? 'ring-2 ring-blue-500' : '' 
      }`}
      data-column-id={columnId}
      onDragOver={(e) => handleDragOver(e, columnId)} 
      onDragLeave={(e) => handleDragLeave(e, columnId)} 
      onDrop={(e) => handleDrop(e, columnId)} 
      onDragEnd={handleDragEnd}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>
      
      <div 
        className={`space-y-3 min-h-52 rounded-lg p-2 ${isEmpty ? 'bg-gray-50' : 'bg-gray-100'}`}
        data-type="column"
        data-column-id={columnId}
      >
        {isEmpty ? (
          <div 
            className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg text-gray-500"
            id={`empty-column-${columnId}`}
          >
            Drop task here
          </div>
        ) : (
          sortedTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              handleDragStart={(e) => handleDragStart(e, task._id, task.column)}
              handleDragOver={(e) => handleDragOver(e, task.column, task._id)}
              handleDragLeave={(e) => handleDragLeave(e, task.column, task._id)}
              handleDrop={(e) => handleDrop(e, task.column, task._id)}
              isDropTarget={dropTargetId === task._id}
            />
          ))
        )}
      </div>
    </div>
  );
};