import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { Service } from "@/types/Service";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = ["services"];

const fetchServices = async (
  sorting: SortRule[],
  filters: FilterRule[],
): Promise<{ items: Service[]; total: number }> => {
  let query = supabase
    .from("service")
    .select("*, category:category_id (*)", { count: "exact" });

  query = applyFilters(query, filters);

  for (const sort of sorting) {
    query = query.order(sort.id, { ascending: !sort.desc });
  }

  if (!sorting.length) {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query;

  if (error) throw new Error(error.message);

  const items = (data ?? []).map((service) => {
    if (!service.image_path) return { ...service, image_public_url: "" };
    const { data: urlData } = supabase.storage
      .from("services")
      .getPublicUrl(service.image_path);
    return { ...service, image_public_url: urlData.publicUrl };
  });

  return { items, total: count ?? 0 };
};

export const useServices = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) => {
  return useQuery({
    queryKey: [...QUERY_KEY, sorting, filters],
    queryFn: () => fetchServices(sorting, filters),
    staleTime: 1000 * 60 * 5,
  });
};
