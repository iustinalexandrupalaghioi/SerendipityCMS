import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { useInfiniteTable } from "@/hooks/useInfiniteQuery";
import { supabase } from "@/lib/supabaseClient";
import type { Appointment, AppointmentStatus } from "@/types/Appointment";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const appointmentKeys = {
  all: ["appointments"] as const,
  list: (sorting: SortRule[], filters: FilterRule[]) =>
    [...appointmentKeys.all, sorting, filters] as const,
  count: (filters?: AppointmentFilters) =>
    ["appointments_count", filters] as const,
};

const PAGE_SIZE = 50;

export const useAppointments = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) =>
  useInfiniteTable<Appointment>({
    queryKey: appointmentKeys.list(sorting, filters),
    pageSize: PAGE_SIZE,
    fetchPage: async (pageParam) => {
      const from = pageParam * PAGE_SIZE;

      let query = supabase
        .from("appointment")
        .select(
          "*, profile!inner(id, full_name, email, display_id), service!inner(id, title, image_path, price, advance_price, display_id)",
          { count: "exact" },
        );

      query = applyFilters(query, filters);

      for (const sort of sorting) {
        const sortCol = sort.origin ? `${sort.origin}(${sort.id})` : sort.id;
        query = query.order(sortCol, { ascending: !sort.desc });
      }

      if (!sorting.length) {
        query = query.order("created_at", { ascending: false });
      }

      const { data, count, error } = await query.range(
        from,
        from + PAGE_SIZE - 1,
      );
      if (error) throw new Error(error.message);

      const items = (data ?? []).map((appointment) => {
        if (!appointment.service?.image_path) return appointment;
        const { data: urlData } = supabase.storage
          .from("services")
          .getPublicUrl(appointment.service.image_path);
        return {
          ...appointment,
          service: {
            ...appointment.service,
            image_public_url: urlData.publicUrl,
          },
        };
      });

      return {
        items: items as Appointment[],
        total: count ?? 0,
        pageIndex: pageParam,
      };
    },
  });

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

  if (filters?.today) {
    const today = format(new Date(), "yyyy-MM-dd");
    query = query.eq("date", today);
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
    queryKey: appointmentKeys.count(filters),
    queryFn: () => fetchAppointmentsCount(filters),
    staleTime: 1000 * 60 * 5,
  });
};
