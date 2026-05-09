import { z } from "zod";

export const freeDaySchema = z.object({
  display_id: z.number().optional(),
  date_from: z.string(),
  date_until: z.string(),
});

export type FreeDayFormValues = z.infer<typeof freeDaySchema>;
