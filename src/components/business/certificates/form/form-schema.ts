import { z } from "zod";

const imageFile = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image must be less than 5MB",
  })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Only image files are allowed",
  })
  .optional();

export const CertificateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  issuing_authority: z
    .string()
    .min(3, "Issuing authority must be at least 3 characters"),
  image: imageFile,
  is_featured: z.boolean(),
});

export type CertificateFormValues = z.infer<typeof CertificateSchema>;
