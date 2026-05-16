import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { useInfiniteTable } from "@/hooks/useInfiniteQuery";
import { supabase } from "@/lib/supabaseClient";
import type { EmailTemplate } from "@/types/Email";

export const emailTemplateKeys = {
  all: ["email_templates"] as const,
  list: (sorting: SortRule[], filters: FilterRule[]) =>
    [...emailTemplateKeys.all, sorting, filters] as const,
};

const PAGE_SIZE = 50;

export const useEmailTemplates = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) =>
  useInfiniteTable<EmailTemplate>({
    queryKey: emailTemplateKeys.list(sorting, filters),
    pageSize: PAGE_SIZE,
    fetchPage: async (pageParam) => {
      const from = pageParam * PAGE_SIZE;

      let query = supabase
        .from("email_template")
        .select("*", { count: "exact" });

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
        items: (data ?? []) as EmailTemplate[],
        total: count ?? 0,
        pageIndex: pageParam,
      };
    },
  });
