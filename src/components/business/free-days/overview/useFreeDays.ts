import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { FreeDay } from "@/types/FreeDay";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = ["free_days"];

// ─────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────

const fetchFreeDays = async (
  sorting: SortRule[],
  filters: FilterRule[],
): Promise<{ items: FreeDay[]; total: number }> => {
  let query = supabase.from("free_day").select("*", { count: "exact" });

  // filters
  query = applyFilters(query, filters);

  // sorting
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

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useFreeDays = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) => {
  return useQuery({
    queryKey: [...QUERY_KEY, sorting, filters],
    queryFn: () => fetchFreeDays(sorting, filters),
    staleTime: 1000 * 60 * 5,
  });
};
