"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EmployeeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user.role !== "employee") {
      router.push("/");
    } else {
      fetchTasks();
    }
  }, [session, status, router]);

  const fetchTasks = async () => {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    if (response.ok) {
      setNewTask({ title: "", description: "" });
      fetchTasks();
    }
  };

  const handleComplete = async (taskId: string) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    if (response.ok) {
      fetchTasks();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">社員ダッシュボード</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>新しいタスクを追加</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="タスクのタイトル"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <Textarea
              placeholder="タスクの説明"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <Button type="submit">タスクを追加</Button>
          </form>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mb-2">タスク一覧</h2>
      <ul className="space-y-2">
        {tasks.map((task: any) => (
          <li key={task.id} className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500 mt-2">ステータス: {task.status}</p>
            {task.status !== "completed" && (
              <Button
                onClick={() => handleComplete(task.id)}
                className="mt-2"
                variant="outline"
              >
                完了
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}