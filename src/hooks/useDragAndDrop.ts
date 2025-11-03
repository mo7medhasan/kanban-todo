import { useState } from 'react';
import { Task } from '@/types/task.types';

export type DraggedTaskData = {
  taskId: string;
  sourceColumnId: string;
};

export const useDragAndDrop = (
  tasks: Task[],
  moveTask: (id: string, newColumn: string) => void,
  updateTaskOrder: (columnId: string, orderedIds: string[]) => void
) => {
  const [draggedTask, setDraggedTask] = useState<DraggedTaskData | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null); // Track the specific task being hovered over

/**
 * Handle drag start event for a task.
 * Sets the dragged task data and allows the move effect.
 * @param {React.DragEvent} e - The drag start event.
 * @param {string} taskId - The ID of the task being dragged.
 * @param {string} columnId - The ID of the column the task is being dragged from.
 */
  const handleDragStart = (e: React.DragEvent, taskId: string, columnId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.setData('application/json', JSON.stringify({ taskId, sourceColumnId: columnId }));
    setDraggedTask({ taskId, sourceColumnId: columnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string, taskId?: string) => {
    e.preventDefault(); // Necessary to allow drop
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
    if (taskId) {
      // If we are dragging over a specific task within the same column
      const sourceColumnId = draggedTask?.sourceColumnId;
      if (sourceColumnId && sourceColumnId === columnId) {
        setDropTargetId(taskId);
      }
    } else {
      // Dragging over the column container itself
      setDropTargetId(null);
    }
  };

  const handleDragLeave = (e: React.DragEvent, columnId: string, taskId?: string) => {
    // Clear drop target only if leaving the specific task element, not just moving within it
    if (taskId && dropTargetId === taskId && e.currentTarget !== e.relatedTarget) {
        setDropTargetId(null);
    }
    // Clear column highlight only if leaving the column container
    if (!taskId && dragOverColumn === columnId && e.currentTarget !== e.relatedTarget) {
        setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string, targetTaskId?: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    setDropTargetId(null);

    if (!draggedTask) return;

    const { taskId, sourceColumnId } = draggedTask;

    if (sourceColumnId !== targetColumnId) {
      // Moving to a different column
      moveTask(taskId, targetColumnId);
    } else if (targetTaskId && sourceColumnId === targetColumnId && taskId !== targetTaskId) {
      // Reordering within the same column
      handleReorderWithinColumn(sourceColumnId, taskId, targetTaskId);
    }
    // If dropped on the column container (targetTaskId is undefined) in the same column,
    // no reorder action is needed (it might just be a drop into an empty area or a no-op).

    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
    setDropTargetId(null);
  };

  const handleReorderWithinColumn = (columnId: string, draggedId: string, targetId: string) => {
    const columnTasks = tasks.filter(t => t.column === columnId);
    const draggedIndex = columnTasks.findIndex(t => t._id === draggedId);
    const targetIndex = columnTasks.findIndex(t => t._id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...columnTasks.map(t => t._id)];
    const [removed] = newOrder.splice(draggedIndex, 1);
    // Determine where to insert based on the target task's index
    const insertIndex = newOrder.indexOf(targetId);
    if (insertIndex !== -1) {
        newOrder.splice(insertIndex, 0, removed);
    } else {
        // Fallback: add to end if target somehow disappeared
        newOrder.push(removed);
    }

    updateTaskOrder(columnId, newOrder);
  };

  return {
    draggedTask,
    dragOverColumn,
    dropTargetId,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
};