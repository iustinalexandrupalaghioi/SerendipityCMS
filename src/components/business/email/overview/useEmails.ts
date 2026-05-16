import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { useInfiniteTable } from "@/hooks/useInfiniteQuery";
import { supabase } from "@/lib/supabaseClient";
import type { Email } from "@/types/Email";
import { useQuery } from "@tanstack/react-query";

export const emailKeys = {
  all: ["emails"] as const,
  list: (sorting: SortRule[], filters: FilterRule[]) =>
    [...emailKeys.all, sorting, filters] as const,
  count: (filters?: EmailFilters) => ["emails_count", filters] as const,
};

const PAGE_SIZE = 30;

export const useEmails = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) =>
  useInfiniteTable<Email>({
    queryKey: emailKeys.list(sorting, filters),
    pageSize: PAGE_SIZE,
    fetchPage: async (pageParam) => {
      const from = pageParam * PAGE_SIZE;

      let query = supabase.from("email").select("*", { count: "exact" });

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

      return {
        items: (data ?? []) as Email[],
        total: count ?? 0,
        pageIndex: pageParam,
      };
    },
  });

export type EmailFilters = {
  error?: boolean;
};

const fetchEmailsCount = async (filters?: EmailFilters): Promise<number> => {
  let query = supabase
    .from("email")
    .select("id", { count: "exact", head: true });

  if (filters?.error) {
    query = query.eq("error", filters.error);
  }

  const { count, error } = await query;
  if (error) {
    console.error("Error fetching Emails:", error);
    throw new Error(error.message);
  }

  return count ?? 0;
};

export const useEmailsCount = (filters?: EmailFilters) => {
  return useQuery({
    queryKey: emailKeys.count(filters),
    queryFn: () => fetchEmailsCount(filters),
    staleTime: 1000 * 60 * 5,
  });
};
