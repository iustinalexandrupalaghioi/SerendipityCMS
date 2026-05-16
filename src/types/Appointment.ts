import type { Service } from "./Service";
import type { Profile } from "./User";

export const APPOINTMENT_STATUSES = [
  "pending",
  "accepted",
  "confirmed",
  "declined",
  "completed",
  "cancelled",
  "expired",
  "no_show",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  confirmed: "Confirmed",
  declined: "Declined",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
  no_show: "No show",
};

export const APPOINTMENT_STATUS_OPTIONS = APPOINTMENT_STATUSES.map(
  (status) => ({
    label: APPOINTMENT_STATUS_LABELS[status],
    value: status,
  }),
);

export type Appointment = {
  id: string;
  display_id: number;
  user_id: string;
  name: string;
  email: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  price: number;
  advance_payment: number;
  advance_payment_paid: boolean;
  status: AppointmentStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  customerName: string;
  profile?: Profile;
  service: Service;
  accepted_at: string;
  paid_at: string;
  declined_at: string;
  starts_at: string;
  expired_at: string;
  expires_at: string;
  payment_intent_id?: string;
};
