import type { Course, CourseSession } from "@/types/Course";
import type { Profile } from "@/types/User";
import { z } from "zod";

export const EnrollmentSchema = z.object({
  id: z.string().optional(),
  courseSession: z
    .custom<CourseSession>()
    .refine(
      (val) =>
        val !== null && typeof val === "object" && Object.keys(val).length > 0,
      { message: "Course session is a mandatory field" },
    ),
  course: z
    .custom<Course>()
    .refine(
      (val) =>
        val !== null && typeof val === "object" && Object.keys(val).length > 0,
      { message: "Course is a mandatory field" },
    ),
  user: z
    .custom<Profile>()
    .refine(
      (val) =>
        val !== null && typeof val === "object" && Object.keys(val).length > 0,
      { message: "Customer is a mandatory field" },
    ),
  payment_type: z.enum(["full", "deposit"]),
  date_of_birth: z.string().optional(),
  price: z
    .number({ message: "Price must be a number" })
    .min(0, "Price must greater than 0"),
  advance_price: z
    .number({ message: "Advance price must be a number" })
    .min(0, "Advance price must greater than 0")
    .nullable(),
});

export type EnrollmentFormValues = z.infer<typeof EnrollmentSchema>;
