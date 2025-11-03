import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/services/api";
import { Task, TaskFormData } from "@/types/task.types";

export const TASKS_QUERY_KEY = "tasks";

export const useTasks = () =>
  useQuery({
    queryKey: [TASKS_QUERY_KEY],
    queryFn: taskApi.getTasks,
  });

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskData: TaskFormData) => taskApi.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      taskApi.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

// Delete task mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

// Move task mutation
export const useMoveTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newColumn }: { id: string; newColumn: string }) =>
      taskApi.moveTask(id, newColumn),
    onMutate: async ({ id, newColumn }) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY] });
      const previous = queryClient.getQueryData<Task[]>([TASKS_QUERY_KEY]);
      queryClient.setQueryData<Task[]>([TASKS_QUERY_KEY], (old) =>
        old?.map((task) =>
          task._id === id ? { ...task, column: newColumn as never } : task
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData([TASKS_QUERY_KEY], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};




/** 🧩 Update task order within a column */
export interface UpdateTaskOrderData {
  column: Task["column"];
  taskIds: string[];
}

export const useUpdateTaskOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ column, taskIds }: UpdateTaskOrderData) =>
      taskApi.updateTaskOrder(column, taskIds),

    onMutate: async ({ column, taskIds }) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY] });
      const previous = queryClient.getQueryData<Task[]>([TASKS_QUERY_KEY]);

      queryClient.setQueryData<Task[]>([TASKS_QUERY_KEY], (old) => {
        if (!old) return old;

        const updated = old.map((t) =>
          taskIds.includes(t._id)
            ? {
                ...t,
                order: taskIds.indexOf(t._id),
                column,
              }
            : t
        );

        return [...updated].sort((a, b) => {
          if (a.column === b.column) {
            return a.order - b.order;
          }
          return 0;
        });
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([TASKS_QUERY_KEY], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};
