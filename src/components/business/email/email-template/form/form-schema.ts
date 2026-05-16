import { EMAIL_TYPES } from "@/types/Email";
import { z } from "zod";

export const emailTemplateSchema = z.object({
  display_id: z.number().optional(),
  id: z.string().optional(),
  email_type: z.enum(EMAIL_TYPES),
});

export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;
