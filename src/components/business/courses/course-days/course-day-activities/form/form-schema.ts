import type { CourseDay } from "@/types/Course";
import { z } from "zod";

export const CourseDayActivitySchema = z.object({
  id: z.string().optional(),
  activity: z.string().min(3, "Activity must be at least 3 characters"),
  course_day: z
    .custom<CourseDay>()
    .refine(
      (val) =>
        val !== null && typeof val === "object" && Object.keys(val).length > 0,
      { message: "course day is a mandatory field" },
    ),
});

export type CourseDayActivityFormValues = z.infer<
  typeof CourseDayActivitySchema
>;
