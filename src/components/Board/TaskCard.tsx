import React, { useState, useRef } from 'react';
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
  // isDropTarget
}) => {
  // const [isDragging, setIsDragging] = useState(false);
  // const [touchStartY, setTouchStartY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Touch event handlers for mobile
  // const handleTouchStart = (e: React.TouchEvent) => {
  //   const touch = e.touches[0];
  //   setTouchStartY(touch.clientY);
  //   setIsDragging(true);
    
  //   // Create a synthetic drag start event
  //   const syntheticEvent = {
  //     dataTransfer: {
  //       effectAllowed: 'move',
  //       setData: (type: string, val: string) => {},
  //       getData: (type: string) => task._id,
  //     },
  //     preventDefault: () => {},
  //     stopPropagation: () => {},
  //   } as unknown as React.DragEvent;
    
  //   handleDragStart(syntheticEvent);
  // };

  // const handleTouchMove = (e: React.TouchEvent) => {
  //   if (!isDragging) return;
    
  //   const touch = e.touches[0];
  //   const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
  //   // Find the closest task card or column
  //   const targetCard = element?.closest('[data-task-card]');
  //   const targetColumn = element?.closest('[data-column]');
    
  //   if (targetCard || targetColumn) {
  //     const syntheticEvent = {
  //       preventDefault: () => {},
  //       stopPropagation: () => {},
  //       dataTransfer: {
  //         getData: () => task._id,
  //       },
  //     } as unknown as React.DragEvent;
      
  //     handleDragOver(syntheticEvent);
  //   }
    
  //   // Visual feedback - move the card with touch
  //   if (cardRef.current) {
  //     const deltaY = touch.clientY - touchStartY;
  //     cardRef.current.style.transform = `translateY(${deltaY}px)`;
  //     cardRef.current.style.opacity = '0.7';
  //   }
  // };

  // const handleTouchEnd = (e: React.TouchEvent) => {
  //   if (!isDragging) return;
    
  //   setIsDragging(false);
    
  //   // Reset visual state
  //   if (cardRef.current) {
  //     cardRef.current.style.transform = '';
  //     cardRef.current.style.opacity = '';
  //   }
    
  //   const touch = e.changedTouches[0];
  //   const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
  //   // Find drop target
  //   const targetCard = element?.closest('[data-task-card]');
  //   const targetColumn = element?.closest('[data-column]');
    
  //   if (targetCard || targetColumn) {
  //     const syntheticEvent = {
  //       preventDefault: () => {},
  //       stopPropagation: () => {},
  //       dataTransfer: {
  //         getData: () => task._id,
  //       },
  //     } as unknown as React.DragEvent;
      
  //     handleDrop(syntheticEvent);
  //   } else {
  //     handleDragLeave({} as React.DragEvent);
  //   }
  // };

  return (
    <div
      ref={cardRef}
      data-task-card
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave} 
      onDrop={handleDrop}
      // onTouchStart={handleTouchStart}
      // onTouchMove={handleTouchMove}
      // onTouchEnd={handleTouchEnd}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
        <div className="cursor-grab active:cursor-grabbing touch-none ml-2 text-gray-400 hover:text-gray-600">
          <GripVertical size={20} />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onEdit(task)}
          className="text-gray-600 hover:text-blue-600 transition-colors p-2 touch-manipulation"
          aria-label="Edit task"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="text-gray-600 hover:text-red-600 transition-colors p-2 touch-manipulation"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};