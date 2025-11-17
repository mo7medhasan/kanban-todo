"use client";

import { SearchBar } from "../SearchBar/SearchBar";
import { Column } from "./Column";
import { AddTaskModal } from "../Modals/AddTaskModal";
import { EditTaskModal } from "../Modals/EditTaskModal";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useMoveTask,
  useUpdateTaskOrder,
} from "@/hooks/useTasksQuery";
import { useTaskStore } from "@/hooks/useTaskStore";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { COLUMNS } from "@/utils/constants";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { ColumnId, Task } from "@/types/task.types";

export default function KanbanBoardWithAPI() {
  const {
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    isEditModalOpen,
    editingTask,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
  } = useTaskStore();

  const { data: tasks = [], isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const moveTask = useMoveTask();
  const updateTaskOrder = useUpdateTaskOrder();
  const { tasksByColumn } = useTaskFilters(tasks, searchQuery);
  const {
    draggedTask,
    dragOverColumn,
    handleDragStart,
    dropTargetId,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useDragAndDrop(
    tasks,
    (id, newColumn) => moveTask.mutate({ id, newColumn }),
    (columnId, orderedIds) =>
      updateTaskOrder.mutate({ column: columnId as Task["column"], taskIds: orderedIds })
  );

  // Enable auto-scroll when dragging
  useAutoScroll({ 
    enabled: draggedTask !== null,
    scrollThreshold: 100,
    scrollSpeed: 15
  });

  if (isLoading)
    return (
      <div className="text-center py-20 text-gray-600">Loading tasks...</div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-600">Error loading tasks</div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-600 to-cyan-70000 p-8">
      <div className="max-w-7xl mx-auto">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={openAddModal}
        />

        <div
          className="flex gap-6 overflow-x-auto overflow-y-auto pb-4 scroll-container"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragEnd}
        >
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              title={column.title}
              columnId={column.id as ColumnId}
              tasks={tasksByColumn[column.id]}
              onEdit={openEditModal}
              onDelete={(id) => deleteTask.mutate(id)}
              draggedTask={draggedTask}
              dragOverColumn={dragOverColumn}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleDragEnd={handleDragEnd}
              dropTargetId={dropTargetId}
            />
          ))}
        </div>

        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onAdd={(taskData) => createTask.mutate(taskData)}
        />

        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onEdit={(id, updates) => updateTask.mutate({ id, updates })}
          task={editingTask}
          key={editingTask?._id}
        />
      </div>
    </div>
  );
}