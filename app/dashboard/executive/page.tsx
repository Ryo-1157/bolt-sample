import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function ExecutiveDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "executive") {
    redirect("/login");
  }

  const employees = await prisma.user.findMany({
    where: { role: "employee" },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">幹部ダッシュボード</h1>
      <h2 className="text-xl font-semibold mb-2">社員一覧</h2>
      <ul className="space-y-2">
        {employees.map((employee) => (
          <li key={employee.id} className="bg-white shadow rounded-lg p-4">
            <Link href={`/dashboard/executive/employee/${employee.id}`}>
              <span className="text-blue-600 hover:underline">{employee.name}</span>
            </Link>
            <span className="ml-2 text-gray-500">{employee.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}