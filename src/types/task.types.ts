export type ColumnId = "backlog" | "in-progress" | "review" | "done";

export interface Task {
  _id: string;           // ✅ من MongoDB
  title: string;
  description: string;
  column: ColumnId;
  order: number;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export type TaskFormData = Omit<Task, "_id">;
