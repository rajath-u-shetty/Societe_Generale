import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth/utils";
import { Role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Extend the Session interface to include custom properties
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      access: Role;
    };
  }
}

// NextAuth handler with custom request handling
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Log the referrer URL of the request
  const referrer = req.headers.referer || req.headers.referrer;
  console.log(`Referrer URL: ${referrer}`);

  // Proceed with NextAuth handling
  return NextAuth(req, res, authOptions);
};

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };
