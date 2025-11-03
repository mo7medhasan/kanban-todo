import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export type ColumnId = "backlog" | "in-progress" | "review" | "done";
export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnId;
  order: number;
}

const dbPath = path.join(process.cwd(), "db.json");

async function readDB(): Promise<{ tasks: Task[] }> {
  const data = await fs.readFile(dbPath, "utf8");
  return JSON.parse(data);
}

async function writeDB(newData: { tasks: Task[] }) {
  await fs.writeFile(dbPath, JSON.stringify(newData, null, 2), "utf8");
}

// GET /api/tasks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const column = searchParams.get("column");
  const page = Number(searchParams.get("_page") || 1);
  const limit = Number(searchParams.get("_limit") || 50);

  const db = await readDB();
  let filtered = db.tasks;

  if (query) filtered = filtered.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
  if (column) filtered = filtered.filter(t => t.column === column);

  const paginated = filtered.slice((page - 1) * limit, page * limit);
  return NextResponse.json(paginated);
}

// POST /api/tasks
export async function POST(request: Request) {
  const body = await request.json();
  const db = await readDB();

  const newTask: Task = {
    id: String(Date.now()),
    order: db.tasks.length,
    ...body,
  };

  db.tasks.push(newTask);
  await writeDB(db);

  return NextResponse.json(newTask, { status: 201 });
}
