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
  courseId: string | undefined,
): Promise<{ items: Enrollment[]; total: number }> => {
  let query = supabase
    .from("course_enrollment")
    .select("*, course!inner(*), profile!inner(*)", { count: "exact" });

  if (courseId) query = query.eq("course_id", courseId); // ← only apply if present

  query = applyFilters(query, filters);

  for (const sort of sorting) {
    const sortCol = sort.origin ? `${sort.origin}(${sort.id})` : sort.id;
    query = query.order(sortCol, { ascending: !sort.desc });
  }

  if (!sorting.length) {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { items: data ?? [], total: count ?? 0 };
};

export const useEnrollments = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
  courseId?: string,
) => {
  return useQuery({
    queryKey: [...QUERY_KEY, courseId, sorting, filters],
    queryFn: () => fetchEnrollments(sorting, filters, courseId),
    staleTime: 1000 * 60 * 5,
  });
};
