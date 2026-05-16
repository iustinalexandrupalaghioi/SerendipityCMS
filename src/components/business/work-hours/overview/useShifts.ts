import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { useInfiniteTable } from "@/hooks/useInfiniteQuery";
import { supabase } from "@/lib/supabaseClient";
import type { Shift } from "@/types/Shift";

export const QUERY_KEY = ["shifts"];

const PAGE_SIZE = 50;

export const useShifts = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) =>
  useInfiniteTable<Shift>({
    queryKey: [...QUERY_KEY, sorting, filters],
    pageSize: PAGE_SIZE,
    fetchPage: async (pageParam) => {
      const from = pageParam * PAGE_SIZE;

      let query = supabase
        .from("shift")
        .select("*, work_hour (*)", { count: "exact" });

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
        items: (data ?? []) as Shift[],
        total: count ?? 0,
        pageIndex: pageParam,
      };
    },
  });
