import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth/utils";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      access: Role
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
