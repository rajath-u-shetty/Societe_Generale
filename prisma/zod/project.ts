import * as z from "zod"
import { CompleteOrganization, relatedOrganizationSchema, CompleteUserProject, relatedUserProjectSchema, CompleteSOP, relatedSOPSchema } from "./index"

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteProject extends z.infer<typeof projectSchema> {
  organization: CompleteOrganization
  users: CompleteUserProject[]
  sops: CompleteSOP[]
}

/**
 * relatedProjectSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProjectSchema: z.ZodSchema<CompleteProject> = z.lazy(() => projectSchema.extend({
  organization: relatedOrganizationSchema,
  users: relatedUserProjectSchema.array(),
  sops: relatedSOPSchema.array(),
}))
