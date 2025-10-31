
import { useMemo } from 'react';
import { Task, ColumnId } from '@/types/task.types';
import { COLUMNS } from '@/utils/constants';

export const useTaskFilters = (tasks: Task[], searchQuery: string) => {
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    
    const query = searchQuery.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, col) => {
      acc[col.id] = filteredTasks.filter(task => task.column === col.id);
      return acc;
    }, {} as Record<ColumnId, Task[]>);
  }, [filteredTasks]);

  return { filteredTasks, tasksByColumn };
};