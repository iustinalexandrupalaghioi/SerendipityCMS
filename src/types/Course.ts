import type { Profile } from "./User";

export type Course = {
  id: string;
  display_id: number;
  title: string;
  description: string;
  display_order: number;
  location: string;
  level: CourseLevel;
  price: number;
  advance_price: number;
  duration_days: number;
  image_url: string;
  image_path: string;
  created_at: string;
  available_spots: number;
  remaining_spots: number;
  is_open: boolean;
  course_day?: CourseDay[];
  course_session?: CourseSession[];
};

export type CourseDay = {
  id: string;
  display_id: number;
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
  display_id: number;
  course_day_id: string;
  course_day?: CourseDay;
  activity: string;
  created_at: string;
};

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type EnrollmentStatus =
  | "submitted"
  | "confirmed"
  | "cancelled"
  | "completed";

export type Enrollment = {
  id: string;
  display_id: number;
  session_id: string;
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
  course_session?: CourseSession;
};

export type CourseSession = {
  id: string;
  display_id: number;
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
