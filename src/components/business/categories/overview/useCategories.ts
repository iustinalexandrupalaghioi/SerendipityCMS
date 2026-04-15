import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { Category } from "@/types/Category";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = ["categories"];

// ─────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────

const fetchCategories = async (
  sorting: SortRule[],
  filters: FilterRule[],
): Promise<{ items: Category[]; total: number }> => {
  let query = supabase.from("category").select("*", { count: "exact" });

  // ── Filters ──
  query = applyFilters(query, filters);

  // ── Sorting ──
  for (const sort of sorting) {
    query = query.order(sort.id, { ascending: !sort.desc });
  }
  if (!sorting.length) {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { items: data ?? [], total: count ?? 0 };
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useCategories = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) => {
  return useQuery({
    queryKey: [...QUERY_KEY, sorting, filters],
    queryFn: () => fetchCategories(sorting, filters),
    staleTime: 1000 * 60 * 5,
  });
};
