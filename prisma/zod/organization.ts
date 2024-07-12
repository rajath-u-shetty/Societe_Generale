import * as z from "zod"
import { CompleteProject, relatedProjectSchema } from "./index"

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteOrganization extends z.infer<typeof organizationSchema> {
  projects: CompleteProject[]
}

/**
 * relatedOrganizationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedOrganizationSchema: z.ZodSchema<CompleteOrganization> = z.lazy(() => organizationSchema.extend({
  projects: relatedProjectSchema.array(),
}))
