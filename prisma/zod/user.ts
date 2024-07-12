import * as z from "zod"
import { Role } from "@prisma/client"
import { CompleteAccount, relatedAccountSchema, CompleteSession, relatedSessionSchema, CompleteOrganization, relatedOrganizationSchema, CompleteUserProject, relatedUserProjectSchema, CompleteSOP, relatedSOPSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  role: z.nativeEnum(Role),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  organizations: CompleteOrganization[]
  adminOrganizations: CompleteOrganization[]
  userProjects: CompleteUserProject[]
  sops: CompleteSOP[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  accounts: relatedAccountSchema.array(),
  sessions: relatedSessionSchema.array(),
  organizations: relatedOrganizationSchema.array(),
  adminOrganizations: relatedOrganizationSchema.array(),
  userProjects: relatedUserProjectSchema.array(),
  sops: relatedSOPSchema.array(),
}))
