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
  const scrollVelocity = useRef(0);

  // Auto-scroll within column when dragging near window edges
  useEffect(() => {
    if (!draggedTask || dragOverColumn !== columnId) {
      scrollVelocity.current = 0;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const performScroll = () => {
      const column = columnRef.current;
      if (!column) return;

      if (Math.abs(scrollVelocity.current) > 0.1) {
        column.scrollTop += scrollVelocity.current;
        animationFrameId.current = requestAnimationFrame(performScroll);
      } else {
        animationFrameId.current = null;
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const column = columnRef.current;
      if (!column) return;

      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      
      // Use window edges instead of column edges
      const windowHeight = window.innerHeight;
      const scrollThreshold = 100;
      const scrollSpeed = 5;

      // Check if cursor is within the column horizontally
      const columnRect = column.getBoundingClientRect();
      const isWithinColumn = clientX >= columnRect.left && clientX <= columnRect.right;

      if (!isWithinColumn) {
        scrollVelocity.current = 0;
        return;
      }

      const distanceFromTop = clientY;
      const distanceFromBottom = windowHeight - clientY;

      let scrollY = 0;

      // Scroll based on window edges
      if (distanceFromTop < scrollThreshold && distanceFromTop > 0) {
        const intensity = Math.pow((scrollThreshold - distanceFromTop) / scrollThreshold, 2);
        scrollY = -scrollSpeed * intensity;
      } else if (distanceFromBottom < scrollThreshold && distanceFromBottom > 0) {
        const intensity = Math.pow((scrollThreshold - distanceFromBottom) / scrollThreshold, 2);
        scrollY = scrollSpeed * intensity;
      }

      scrollVelocity.current = scrollY;

      if (!animationFrameId.current && Math.abs(scrollY) > 0.1) {
        animationFrameId.current = requestAnimationFrame(performScroll);
      }
    };

    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('touchmove', handleMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [draggedTask, dragOverColumn, columnId]);

  return (
    <div 
      ref={columnRef}
      className={`flex-1 min-w-72 bg-white rounded-lg shadow-md p-4 md:max-h-[80vh] min-h-[70vh] overflow-y-auto ${
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
        className={`space-y-3 md:min-h-52 min-h-[70vh]  rounded-lg p-2 ${isEmpty ? 'bg-gray-50' : 'bg-gray-100'}`}
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