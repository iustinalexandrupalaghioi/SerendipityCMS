import type { AppointmentStatus } from "@/types/Appointment";
import type { Service } from "@/types/Service";
import type { Profile } from "@/types/User";
import { z } from "zod";

export const AppointmentSchema = z.object({
  id: z.string().optional(),
  service: z
    .custom<Service>()
    .refine(
      (val) =>
        val !== null && typeof val === "object" && Object.keys(val).length > 0,
      { message: "Service is a mandatory field" },
    ),
  user: z
    .custom<Profile>()
    .refine(
      (val) =>
        val !== null && typeof val === "object" && Object.keys(val).length > 0,
      { message: "Customer is a mandatory field" },
    ),
  date: z.string().min(5, "Date is a mandatory field"),
  start_time: z
    .string()
    .min(5, "Time is a mandatory field")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Time must be in HH:MM (24h) format",
    }),
  price: z
    .number({ error: "Price is a mandatory field" })
    .min(1, "Price must be a number greater than 1"),
  advance_payment: z
    .number({ error: "Advance price is a mandatory field" })
    .min(1, "Advance price must be a number greater than 1"),
  name: z
    .string({ error: "Name is a mandatory field" })
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long"),
  email: z
    .email({ error: "Email is a mandatory field" })
    .max(255, "Email must be at most 255 characters long"),
  duration: z
    .number({ error: "Duration is a mandatory field" })
    .min(1, "Duration must be a number greater than 1"),
  notes: z
    .string()
    .max(255, "Notes must be at most 255 characters long")
    .optional(),
  status: z.custom<AppointmentStatus>().optional(),
  advance_payment_paid: z.boolean().optional(),
});

export type AppointmentFormValues = z.infer<typeof AppointmentSchema>;
