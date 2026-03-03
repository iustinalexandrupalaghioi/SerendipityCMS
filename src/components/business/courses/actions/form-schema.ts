import { z } from "zod";

export const OpenCourseEnrollmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z
    .number({ message: "Price must be a number" })
    .min(1, "Price must be a number greater than 0"),
  advance_price: z
    .number({ message: "Advance price must be a number" })
    .min(1, "Advance price must be a number greater than 0"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  start_date: z.string().min(5, "Start date is a mandatory field"),
  available_spots: z
    .number({ message: "Available spots must be a number" })
    .min(1, "Available spots must be a number greater than 0"),
});

export type OpenCourseEnrollmentFormValues = z.infer<
  typeof OpenCourseEnrollmentSchema
>;
