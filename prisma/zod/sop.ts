import * as z from "zod"
import { CompleteProject, relatedProjectSchema, CompleteUser, relatedUserSchema } from "./index"

export const sOPSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  aiContent: z.string().nullish(),
  description: z.string(),
  projectId: z.string(),
  createdById: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteSOP extends z.infer<typeof sOPSchema> {
  project: CompleteProject
  createdBy: CompleteUser
}

/**
 * relatedSOPSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSOPSchema: z.ZodSchema<CompleteSOP> = z.lazy(() => sOPSchema.extend({
  project: relatedProjectSchema,
  createdBy: relatedUserSchema,
}))
