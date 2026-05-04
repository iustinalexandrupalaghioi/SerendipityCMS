import type { CourseLevel } from "@/types/Course";
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

export const CourseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(15, "Description must be at least 15 characters")
    .max(500, "Description can be at most 500 characters"),
  display_order: z
    .number({ message: "Display order must be a number" })
    .min(1, "Display order must be a number greater than 0"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  level: z.custom<CourseLevel>(),
  duration_days: z.number({ message: "Duration must be a number" }).optional(),
  price: z
    .number({ message: "Price must be a number" })
    .min(1, "Price must be a number greater than 0"),
  advance_price: z
    .number({ message: "Advance price must be a number" })
    .min(1, "Advance price must be a number greater than 0"),
  image: imageFile,
  image_path: z.string().optional(),
});

export type CourseFormValues = z.infer<typeof CourseSchema>;
