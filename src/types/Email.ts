export const EMAIL_TYPES = [
  "appointment_pending",
  "appointment_accepted",
  "appointment_accepted_with_notes",
  "appointment_declined",
  "appointment_confirmed",
  "enrollment_fully_paid",
  "enrollment_deposit_paid",
  "expired_enrollment",
] as const;

export type EmailType = (typeof EMAIL_TYPES)[number];

export const EMAIL_TYPE_LABELS: Record<EmailType, string> = {
  appointment_pending: "Appointment pending",
  appointment_accepted: "Appointment accepted",
  appointment_accepted_with_notes: "Appointment accepted with notes",
  appointment_declined: "Appointment declined",
  appointment_confirmed: "Appointment confirmed",
  enrollment_fully_paid: "Enrollment fully paid",
  enrollment_deposit_paid: "Enrollment deposit paid",
  expired_enrollment: "Expired enrollment",
};

export const EMAIL_TYPES_OPTIONS = EMAIL_TYPES.map((status) => ({
  label: EMAIL_TYPE_LABELS[status],
  value: status,
}));

export type EmailTemplate = {
  display_id?: number;
  id: string;
  email_type: EmailType;
  created_at?: string;
};

export type Email = {
  appointment_id?: string;
  resend_id: string;
  id: string;
  bcc: string;
  body: JSON;
  course_enrollment_id?: string;
  created_at: string;
  display_id: number;
  error: boolean;
  error_message: string;
  sent: boolean;
  sent_at: string;
  to: string;
  type: EmailType;
};
