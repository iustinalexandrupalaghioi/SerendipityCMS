import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { Appointment } from "@/types/Appointment";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = ["appointments"];

const fetchAppointments = async (
  sorting: SortRule[],
  filters: FilterRule[],
): Promise<{ items: Appointment[]; total: number }> => {
  let query = supabase
    .from("appointment")
    .select(
      "*, profile!inner(id, full_name, email, display_id), service!inner(id, title, image_path, price, advance_price, display_id)",
      {
        count: "exact",
      },
    );

  query = applyFilters(query, filters);

  for (const sort of sorting) {
    const sortCol = sort.origin ? `${sort.origin}(${sort.id})` : sort.id;
    query = query.order(sortCol, { ascending: !sort.desc });
  }

  if (!sorting.length) {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { items: data ?? [], total: count ?? 0 };
};

export const useAppointments = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) => {
  return useQuery({
    queryKey: [...QUERY_KEY, sorting, filters],
    queryFn: () => fetchAppointments(sorting, filters),
    staleTime: 1000 * 60 * 5,
    select: ({ items, total }) => ({
      total,
      items: items.map((appointment) => {
        if (!appointment.service?.image_path) return appointment;
        const { data } = supabase.storage
          .from("services")
          .getPublicUrl(appointment.service.image_path);
        return {
          ...appointment,
          service: { ...appointment.service, image_public_url: data.publicUrl },
        };
      }),
    }),
  });
};
