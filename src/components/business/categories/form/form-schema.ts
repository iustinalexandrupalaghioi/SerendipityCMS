import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name is required"),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
