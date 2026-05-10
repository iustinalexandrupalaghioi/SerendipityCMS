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

export const COURSE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type CourseLevel = (typeof COURSE_LEVELS)[number];
export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
export const COURSE_LEVEL_OPTIONS = COURSE_LEVELS.map((level) => ({
  label: COURSE_LEVEL_LABELS[level],
  value: level,
}));

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
  payment_type: PaymentType;
  advance_price: number;
  advance_payment_paid: boolean;
  created_at: string;
  course_session?: CourseSession;
  payment_intent_id?: string;
};

export const ENROLLMENT_STATUSES = [
  "submitted",
  "confirmed",
  "completed",
  "cancelled",
  "expired",
  "no_show",
  "declined",
] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];
export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  submitted: "Submitted",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
  no_show: "No show",
  declined: "Declined",
};
export const ENROLLMENT_STATUS_OPTIONS = ENROLLMENT_STATUSES.map((status) => ({
  label: ENROLLMENT_STATUS_LABELS[status],
  value: status,
}));

export const PAYMENT_TYPES = ["deposit", "full"] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];
export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  deposit: "Deposit",
  full: "Full",
};
export const PAYMENT_TYPE_OPTIONS = PAYMENT_TYPES.map((level) => ({
  label: PAYMENT_TYPE_LABELS[level],
  value: level,
}));
