import type { Course } from "@/types/Course";
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

export const CourseDaySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  course: z
    .custom<Course>()
    .refine(
      (val) =>
        val !== null && typeof val === "object" && Object.keys(val).length > 0,
      { message: "Course is a mandatory field" },
    ),
  image: imageFile,
  day_number: z
    .number({ message: "Day number must be a number" })
    .min(1, "Day number must be a number greater than 0"),
  image_path: z.string().optional(),
});

export type CourseDayFormValues = z.infer<typeof CourseDaySchema>;
