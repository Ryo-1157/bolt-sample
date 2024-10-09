import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// タスクの更新処理
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await request.json();
  const taskIndex = tasks.findIndex(t => t.id === params.id);

  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], status };
  return NextResponse.json(tasks[taskIndex]);
}