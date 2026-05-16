import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { useInfiniteTable } from "@/hooks/useInfiniteQuery";
import { supabase } from "@/lib/supabaseClient";
import type { Service } from "@/types/Service";

export const QUERY_KEY = ["services"];

const PAGE_SIZE = 50;

export const useServices = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) =>
  useInfiniteTable<Service>({
    queryKey: [...QUERY_KEY, sorting, filters],
    pageSize: PAGE_SIZE,
    fetchPage: async (pageParam) => {
      const from = pageParam * PAGE_SIZE;

      let query = supabase
        .from("service")
        .select("*, category!inner(id, display_id, name)", { count: "exact" });

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

      const items = (data ?? []).map((service) => {
        if (!service.image_path) return { ...service, image_public_url: "" };
        const { data: urlData } = supabase.storage
          .from("services")
          .getPublicUrl(service.image_path);
        return { ...service, image_public_url: urlData.publicUrl };
      });

      return {
        items: items as Service[],
        total: count ?? 0,
        pageIndex: pageParam,
      };
    },
  });
