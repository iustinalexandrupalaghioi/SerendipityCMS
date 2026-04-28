import type { Profile } from "./User";

export type Course = {
  id: string;
  title: string;
  description: string;
  display_order: number;
  location: string;
  start_date: string;
  available_spots: number;
  remaining_spots: number;
  is_open: boolean;
  level: CourseLevel;
  price: number;
  advance_price: number;
  duration_days: number;
  image_url: string;
  image_path: string;
  created_at: string;
  course_day?: CourseDay[];
  course_enrollment?: Enrollment[];
};

export type CourseDay = {
  id: string;
  course_id: string;
  day_number: number;
  title: string;
  image_url: string;
  image_path: string;
  created_at: string;
  course?: Course;
  course_day_activity?: CourseDayActivity[];
};

export type CourseDayActivity = {
  id: string;
  course_day_id: string;
  course_day?: CourseDay;
  activity: string;
  created_at: string;
};

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type EnrollmentStatus =
  | "submitted"
  | "confirmed"
  | "canceled"
  | "completed";

export type Enrollment = {
  id: string;
  course_id: string;
  user_id: string;
  profile?: Profile;
  status: EnrollmentStatus;
  enrollment_date: string;
  course_date: string;
  price: number;
  payment_type: "deposit" | "full";
  advance_price: number;
  advance_payment_paid: boolean;
  created_at: string;
  course?: Course;
};

export type CourseSession = {
  id: string;
  course_id: string;
  start_date: string;
  available_spots: number;
  remaining_spots: number;
  is_open: boolean;
  price: number;
  advance_price: number;
  created_at: string;
  course?: Course;
};
