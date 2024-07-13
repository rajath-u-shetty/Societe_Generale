"use server";

import { authOptions } from "@/lib/auth/utils";
import { ExtendedOrganization } from "@/lib/ExtendedTypes";
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
          projects: true,
        }
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

export const actionFetchOrganizationData = async (organizationId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized", data: null };
  if (!organizationId) return { error: "Missing organizationId", data: null };
  const isUserPartOfOrganization = await db!.organization.findUnique({
    where: {
      id: organizationId,
      users: {
        some: {
          id: session.user.id,
        },
      },
    },
  });

  if (!isUserPartOfOrganization) return { error: "User is not part of this organization" };
  const data : ExtendedOrganization | null = await db!.organization.findUnique({
    where: {
      id: organizationId,
    },
    include: {
      projects: true,
      users: true,
      admin: true,
    },
  });
  return { error: null, data };
};
