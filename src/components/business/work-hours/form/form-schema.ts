import { z } from "zod";

export const shiftSchema = z.object({
  id: z.string().optional(),
  day_start_time: z
    .string()
    .refine((val) => /^([0-9]{0,2}:?[0-9]{0,2})?$/.test(val), {
      message: "Time must be in HH:MM (24h) format",
    }),
  day_end_time: z
    .string()
    .refine((val) => /^([0-9]{0,2}:?[0-9]{0,2})?$/.test(val), {
      message: "Time must be in HH:MM (24h) format",
    }),
  interval: z
    .number({ message: "Interval is a mandatory field" })
    .min(1, "Interval must be a number greater than 1"),
  is_active: z.boolean(),
  monday: z.boolean(),
  tuesday: z.boolean(),
  wednesday: z.boolean(),
  thursday: z.boolean(),
  friday: z.boolean(),
  saturday: z.boolean(),
  sunday: z.boolean(),
});

export type ShiftFormValues = z.infer<typeof shiftSchema>;
