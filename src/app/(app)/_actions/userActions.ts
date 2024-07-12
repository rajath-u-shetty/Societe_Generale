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

export const fetchAllOrganizations = async () => {
  const data = await db!.organization.findMany({
    include: {
      projects: true,
      users: true,
      admin: true,
    },
  });
  return data;
};
