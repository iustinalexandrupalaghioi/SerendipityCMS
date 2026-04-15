import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = ["profiles"];

const fetchProfiles = async (
  sorting: SortRule[],
  filters: FilterRule[],
): Promise<{ items: Profile[]; total: number }> => {
  let query = supabase.from("profile").select("*", { count: "exact" });

  query = applyFilters(query, filters);

  for (const sort of sorting) {
    query = query.order(sort.id, { ascending: !sort.desc });
  }

  if (!sorting.length) {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query;

  if (error) throw new Error(error.message);

  return {
    items: data ?? [],
    total: count ?? 0,
  };
};

export const useUserProfiles = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) => {
  return useQuery({
    queryKey: [...QUERY_KEY, sorting, filters],
    queryFn: () => fetchProfiles(sorting, filters),
    staleTime: 1000 * 60 * 5,
  });
};
