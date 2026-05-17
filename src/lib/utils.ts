import type { ColumnType } from "@/components/data-table/features/filtering/filters";
import {
  APPOINTMENT_STATUSES,
  type AppointmentStatus,
} from "@/types/Appointment";
import { clsx, type ClassValue } from "clsx";
import { format, parse, parseISO } from "date-fns";
import {formatInTimeZone} from "date-fns-tz";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabaseClient";
import type { Enum } from "@/types/EnumType";

const TZ = import.meta.env("VITE_APP_TIMEZONE");

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
  const parsed = parse(timeString, "HH:mm:ss", new Date());
  return format(parsed, "HH:mm");
};

export const formatDate = (value: string | null) => {
  if (!value) return "";
  return format(parseISO(value), "dd-MM-yyyy");
};

export const formatDateTime = (value: string | null) => {
  if (!value) return "";
  return formatInTimeZone(
    new Date(value as string),
    TZ ?? "Europe/Dublin",
    "dd-MM-yyyy HH:mm",
  );
};

export const formatByType = (
  value: unknown,
  type: ColumnType,
  options?: Enum[],
): string => {
  if (value == null || value === "") return "";
  if (type === "boolean") return value ? "Yes" : "No";
  if (type === "select")
    return options?.find((o) => o.value === value)?.label ?? String(value);
  if (type === "date") return format(new Date(value as string), "dd-MM-yyyy");
  if (type === "datetime")
    return formatInTimeZone(parseISO(value), TZ ?? "Europe/Dublin", "dd-MM-yyyy HH:mm")
  if (type === "time") return (value as string).slice(0, 5);
  return String(value);
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

export const colVar = (id: string) =>
  id.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
