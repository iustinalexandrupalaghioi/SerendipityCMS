import z from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  email: z.email("Invalid email address").trim(),
  image: z.any().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
