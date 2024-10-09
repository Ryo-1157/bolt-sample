import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// インメモリデータストア
let tasks = [
  { id: "1", title: "Task 1", description: "Description 1", status: "pending", userId: "2" },
  { id: "2", title: "Task 2", description: "Description 2", status: "completed", userId: "2" },
];

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userTasks = tasks.filter(task => task.userId === session.user.id);
  return NextResponse.json(userTasks);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description } = await request.json();
  const newTask = {
    id: String(tasks.length + 1),
    title,
    description,
    status: "pending",
    userId: session.user.id,
  };

  tasks.push(newTask);
  return NextResponse.json(newTask);
}