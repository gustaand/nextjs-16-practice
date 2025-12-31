import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "El titulo es obligatirio"),
  author: z.string().optional()
})

export const patchBookSchema = z.object({
  read: z.boolean().optional(),
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
})