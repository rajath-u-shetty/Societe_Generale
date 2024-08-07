import { Organization, Project, Role, User, UserProject } from "@prisma/client";

export type ExtendedOrganization = Organization & {
  users: User[];
  projects: Project[];
  admin : User;
};

export type ExtendedUser = User & {
  organizations: ExtendedOrganization[];
  userProjects: UserProject[];
};

export type ExtendedUserData = {
  organizations: ExtendedOrganization[];
  userProjects: UserProject[];
} & {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
} | null;
