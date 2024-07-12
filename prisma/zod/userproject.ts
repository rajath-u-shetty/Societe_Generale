import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteProject, relatedProjectSchema } from "./index"

export const userProjectSchema = z.object({
  id: z.string(),
  userId: z.string(),
  projectId: z.string(),
})

export interface CompleteUserProject extends z.infer<typeof userProjectSchema> {
  user: CompleteUser
  project: CompleteProject
}

/**
 * relatedUserProjectSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserProjectSchema: z.ZodSchema<CompleteUserProject> = z.lazy(() => userProjectSchema.extend({
  user: relatedUserSchema,
  project: relatedProjectSchema,
}))
