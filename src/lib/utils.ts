import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabaseClient";
import { format, parse } from "date-fns";
import {
  APPOINTMENT_STATUSES,
  type AppointmentStatus,
} from "@/types/Appointment";
import { useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleScroll = (id: string) => {
  const services = document.getElementById(id);
  if (services) {
    services.scrollIntoView({ behavior: "smooth" });
  }
};

export const scrollToTop = () => scrollTo(0, 0);

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const filePath = `services/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("services")
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("services").getPublicUrl(filePath);

  return data.publicUrl;
}

export const formatTime = (timeString?: string) => {
  if (!timeString) return "";

  // Supabase returns "HH:mm:ss" → parse it
  const parsed = parse(timeString, "HH:mm:ss", new Date());

  // format as HH:mm
  return format(parsed, "HH:mm");
};

export const isAppointmentStatus = (
  value: string,
): value is AppointmentStatus => {
  return APPOINTMENT_STATUSES.includes(value as AppointmentStatus);
};

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
