"use server";

import { authOptions } from "@/lib/auth/utils";
import { getServerSession } from "next-auth";

export const getUserData = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const data = await db!.user.findFirst({
    where: {
      id: session.user.id,
    },
    include: {
      userProjects: {
        include: {
          project: true,
          user: true,
        },
      },
      organizations: {
        include: {
          users: true,
          projects: true
        },
      },
    }
  });
  return data;
};
