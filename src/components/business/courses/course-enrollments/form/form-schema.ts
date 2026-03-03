import type { Course } from "@/types/Course";
import type { Profile } from "@/types/User";
import { z } from "zod";

export const EnrollmentSchema = z.object({
  id: z.string().optional(),
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
      { message: "Student is a mandatory field" },
    ),
});

export type EnrollmentFormValues = z.infer<typeof EnrollmentSchema>;
