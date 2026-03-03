import type { Service } from "@/types/Service";
import { z } from "zod";

export const AppointmentSchema = z.object({
  id: z.string(),
  service: z
    .custom<Service>()
    .refine(
      (val) =>
        val !== null && typeof val === "object" && Object.keys(val).length > 0,
      { message: "Service is a mandatory field" },
    ),
  date: z.string().min(5, "Date is a mandatory field"),
  start_time: z
    .string()
    .min(5, "Start time is a mandatory field")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Start time must be in HH:MM (24h) format",
    }),
  end_time: z
    .string()
    .min(5, "End time is a mandatory field")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "End time must be in HH:MM (24h) format",
    }),
  price: z
    .number({ error: "Price is a mandatory field" })
    .min(1, "Price must be a number greater than 1"),
  advance_payment: z
    .number({ error: "Advance payment is a mandatory field" })
    .min(1, "Advance payment must be a number greater than 1"),
  name: z
    .string({ error: "Name is a mandatory field" })
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long"),
  email: z
    .email({ error: "Email is a mandatory field" })
    .max(255, "Email must be at most 255 characters long"),
  duration: z
    .number({ error: "Duration is a mandatory field" })
    .min(1, "Duration must be a number greater than 1")
    .max(1440, "Duration must be at most 1440 minutes (24 hours)"),
  notes: z
    .string({ error: "Notes is a mandatory field" })
    .min(10, "Notes must be at least 10 characters long")
    .max(255, "Notes must be at most 255 characters long"),
});

export type AppointmentFormValues = z.infer<typeof AppointmentSchema>;
