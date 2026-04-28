import type { Course } from "@/types/Course";
import { z } from "zod";

export const CourseSessionSchema = z
  .object({
    id: z.string().optional(),
    course: z
      .custom<Course>()
      .refine((v): v is Course => !!v.id, "Course is required"),
    start_date: z.string().min(1, "Start date is required"),
    price: z
      .number({ message: "Price must be a number" })
      .min(0, "Price must greater than 0"),
    advance_price: z
      .number({ message: "Advance price must be a number" })
      .min(0, "Advance price must greater than 0")
      .nullable(),
    available_spots: z
      .number({ message: "Available spots must be a number" })
      .int()
      .min(1, "Must have at least 1 spot"),
    remaining_spots: z
      .number({ message: "Remaining spots must be a number" })
      .int()
      .min(0, "Remaining spots cannot be negative"),
    is_open: z.boolean(),
  })
  .refine((data) => data.remaining_spots <= data.available_spots, {
    message: "Remaining spots cannot exceed available spots",
    path: ["remaining_spots"],
  });

export type CourseSessionFormValues = z.infer<typeof CourseSessionSchema>;
