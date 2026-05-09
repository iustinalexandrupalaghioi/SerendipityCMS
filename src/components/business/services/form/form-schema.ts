import type { Category } from "@/types/Category";
import { z } from "zod";

// Reusable image validator
const imageFile = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image must be less than 5MB",
  })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Only image files are allowed",
  })
  .optional();

export const ServiceSchema = z.object({
  display_id: z.number().optional(),
  category: z
    .custom<Category>()
    .refine(
      (val) =>
        val !== null && typeof val === "object" && Object.keys(val).length > 0,
      { message: "Category is a mandatory field" },
    ),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(15, "Description must be at least 15 characters")
    .max(100, "Description can be at most 100 characters"),
  image: imageFile,
  price: z
    .number({ message: `Price must be a number` })
    .min(1, `Price must be greater than 0`),
  advance_price: z
    .number({ message: `Advance price must be a number` })
    .min(1, `Advance price must be greater than 0`),
  duration: z
    .number({ message: `Duration must be a number` })
    .min(1, `Duration must be greater than 0`),
  is_active: z.boolean(),
  is_popular: z.boolean(),
  image_path: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof ServiceSchema>;
