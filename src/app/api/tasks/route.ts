import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export interface Task {
  _id?: string;
  title: string;
  description: string;
  column: "backlog" | "in-progress" | "review" | "done";
  order: number;
}

export async function GET(request: Request) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const tasks = await db.collection("tasks").find().toArray();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const data = await request.json();
  const result = await db.collection("tasks").insertOne(data);
  return NextResponse.json({ _id: result.insertedId, ...data }, { status: 201 });
}
