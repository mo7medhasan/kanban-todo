import React, { useEffect, useRef } from 'react';
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
  dropTargetId: string | null;
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
  draggedTask,
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
  
  const columnRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Auto-scroll within column when dragging near edges
  useEffect(() => {
    if (!draggedTask) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const column = columnRef.current;
      if (!column) return;

      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const rect = column.getBoundingClientRect();
      const scrollThreshold = 80;
      const scrollSpeed = 8;

      const distanceFromTop = clientY - rect.top;
      const distanceFromBottom = rect.bottom - clientY;

      let scrollY = 0;

      if (distanceFromTop < scrollThreshold && distanceFromTop > 0) {
        scrollY = -scrollSpeed * (1 - distanceFromTop / scrollThreshold);
      } else if (distanceFromBottom < scrollThreshold && distanceFromBottom > 0) {
        scrollY = scrollSpeed * (1 - distanceFromBottom / scrollThreshold);
      }

      if (scrollY !== 0) {
        const scroll = () => {
          if (column && Math.abs(scrollY) > 0.1) {
            column.scrollTop += scrollY;
            animationFrameId.current = requestAnimationFrame(scroll);
          }
        };

        if (!animationFrameId.current) {
          animationFrameId.current = requestAnimationFrame(scroll);
        }
      } else {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [draggedTask]);

  return (
    <div 
      ref={columnRef}
      className={`flex-1 min-w-72 bg-white rounded-lg shadow-md p-4 max-h-[80vh] overflow-y-auto scroll-smooth ${
        isOver && !dropTargetId ? 'ring-2 ring-blue-500' : '' 
      }`}
      data-column
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