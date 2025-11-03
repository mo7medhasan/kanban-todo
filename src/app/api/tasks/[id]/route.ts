import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ Get one task
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ لازم await هنا
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });
  return NextResponse.json(task);
}

// ✅ Update task
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
    const updates = await req.json();
    const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
  
    try {
      const result = await db.collection("tasks").updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );
  
      if (result.matchedCount === 0)
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("PATCH error:", error);
      return NextResponse.json({ error: "Invalid ID" }, { status: 500 });
    }
  }
  

// ✅ Delete task
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
