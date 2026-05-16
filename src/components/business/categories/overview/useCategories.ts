import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { useInfiniteTable } from "@/hooks/useInfiniteQuery";
import { supabase } from "@/lib/supabaseClient";
import type { Category } from "@/types/Category";

export const QUERY_KEY = ["categories"];

const PAGE_SIZE = 50;

export const useCategories = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) =>
  useInfiniteTable<Category>({
    queryKey: [...QUERY_KEY, sorting, filters],
    pageSize: PAGE_SIZE,
    fetchPage: async (pageParam) => {
      const from = pageParam * PAGE_SIZE;

      let query = supabase.from("category").select("*", { count: "exact" });

      query = applyFilters(query, filters);

      for (const sort of sorting) {
        query = query.order(sort.id, { ascending: !sort.desc });
      }

      if (!sorting.length) {
        query = query.order("created_at", { ascending: false });
      }

      const { data, count, error } = await query.range(
        from,
        from + PAGE_SIZE - 1,
      );
      if (error) throw new Error(error.message);

      return {
        items: (data ?? []) as Category[],
        total: count ?? 0,
        pageIndex: pageParam,
      };
    },
  });
