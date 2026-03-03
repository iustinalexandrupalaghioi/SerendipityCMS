import { supabase } from "@/lib/supabaseClient";
import type { Appointment, AppointmentStatus } from "@/types/Appointment";
import { useQuery } from "@tanstack/react-query";

const fetchAppointments = async (
  filters?: AppointmentFilters,
): Promise<Appointment[]> => {
  let query = supabase
    .from("appointment")
    .select("*, profile:user_id (*), service:service_id (*)")
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  // Today filter
  if (filters?.today) {
    const now = new Date();

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    query = query
      .gte("date", start.toISOString())
      .lte("date", end.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching appointments:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useAppointments = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: ["appointments", filters],
    queryFn: () => fetchAppointments(filters),
    staleTime: 1000 * 60 * 5,
    select: (appointments: Appointment[]) =>
      appointments.map((appointment) => {
        if (!appointment.service?.image_path) {
          return appointment;
        }

        const { data } = supabase.storage
          .from("services")
          .getPublicUrl(appointment.service.image_path);

        return {
          ...appointment,
          service: {
            ...appointment.service,
            image_public_url: data.publicUrl,
          },
        };
      }),
  });
};

export interface AppointmentFilters {
  status?: AppointmentStatus;
  today?: boolean;
}

const fetchAppointmentsCount = async (
  filters?: AppointmentFilters,
): Promise<number> => {
  let query = supabase
    .from("appointment")
    .select("id", { count: "exact", head: true });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  // Filter for today
  if (filters?.today) {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    query = query.gte("date", start).lte("date", end);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error fetching appointments:", error);
    throw new Error(error.message);
  }

  return count ?? 0;
};

export const useAppointmentsCount = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: ["appointments_count", filters],
    queryFn: () => fetchAppointmentsCount(filters),
    staleTime: 1000 * 60 * 5,
  });
};
