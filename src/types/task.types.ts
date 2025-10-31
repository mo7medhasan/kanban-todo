export type ColumnId = "backlog" | "in-progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnId;
  order: number;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  column: ColumnId;
    id?: string;
    order?: number;
}
