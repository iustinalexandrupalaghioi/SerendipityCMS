import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { Enrollment } from "@/types/Course";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = ["course_enrollments"];

const fetchEnrollments = async (
  sorting: SortRule[],
  filters: FilterRule[],
): Promise<{ items: Enrollment[]; total: number }> => {
  let query = supabase
    .from("course_enrollment")
    .select("*, course(*), profile(*)", { count: "exact" });

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

export const useEnrollments = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) => {
  return useQuery({
    queryKey: [...QUERY_KEY, sorting, filters],
    queryFn: () => fetchEnrollments(sorting, filters),
    staleTime: 1000 * 60 * 5,
  });
};
