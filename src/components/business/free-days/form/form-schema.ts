import { z } from "zod";

export const freeDaySchema = z.object({
  id: z.string().optional(),
  date_from: z.string(),
  date_until: z.string(),
});

export type FreeDayFormValues = z.infer<typeof freeDaySchema>;
