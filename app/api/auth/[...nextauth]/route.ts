import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// インメモリデータストア
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "executive"
  },
  {
    id: "2",
    name: "Employee User",
    email: "employee@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "employee"
  }
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = users.find(u => u.email === credentials.email);
        if (!user) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };