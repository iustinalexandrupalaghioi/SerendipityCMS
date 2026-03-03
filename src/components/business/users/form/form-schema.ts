import { z } from "zod";

export const userProfileSchema = z.object({
  id: z.string(),
  role: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
