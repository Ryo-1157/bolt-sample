import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function EmployeeDetails({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "executive") {
    redirect("/login");
  }

  const employee = await prisma.user.findUnique({
    where: { id: params.id },
    include: { tasks: true },
  });

  if (!employee) {
    return <div>社員が見つかりません</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{employee.name}のタスク一覧</h1>
      <ul className="space-y-2">
        {employee.tasks.map((task) => (
          <li key={task.id} className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500 mt-2">ステータス: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}