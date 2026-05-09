import { z } from "zod";

export const userProfileSchema = z.object({
  id: z.number(),
  role: z.string(),
  full_name: z.string(),
  email: z.string(),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
