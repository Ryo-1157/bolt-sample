import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '会社用タスク管理ツール',
  description: '認証機能を持つ会社用のタスク管理ツール',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ja">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}