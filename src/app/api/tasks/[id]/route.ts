import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import type { Task } from "../route";

const dbPath = path.join(process.cwd(), "db.json");

async function readDB(): Promise<{ tasks: Task[] }> {
  const data = await fs.readFile(dbPath, "utf8");
  return JSON.parse(data);
}

async function writeDB(newData: { tasks: Task[] }) {
  await fs.writeFile(dbPath, JSON.stringify(newData, null, 2), "utf8");
}

// GET /api/tasks/:id
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = await readDB();
  const task = db.tasks.find(t => t.id === params.id);
  return task ? NextResponse.json(task) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

// PATCH /api/tasks/:id
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const updates = await request.json();
  const db = await readDB();

  const index = db.tasks.findIndex(t => t.id === params.id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.tasks[index] = { ...db.tasks[index], ...updates };
  await writeDB(db);

  return NextResponse.json(db.tasks[index]);
}

// DELETE /api/tasks/:id
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const db = await readDB();
  db.tasks = db.tasks.filter(t => t.id !== params.id);
  await writeDB(db);
  return NextResponse.json({}, { status: 204 });
}
