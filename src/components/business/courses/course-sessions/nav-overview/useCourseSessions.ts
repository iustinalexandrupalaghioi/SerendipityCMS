import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { CourseSession } from "@/types/Course";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = ["course-sessions"];
export const OPEN_SESSIONS_QUERY_KEY = ["course-sessions", "open"];
// ─────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────

const fetchCourseSessions = async (
  courseId: string,
  sorting: SortRule[],
  filters: FilterRule[],
): Promise<{ items: CourseSession[]; total: number }> => {
  let query = supabase
    .from("course_session")
    .select("*, course!inner(*)", { count: "exact" })
    .eq("course_id", courseId);

  // ── Filters ──
  query = applyFilters(query, filters);

  // ── Sorting ──
  for (const sort of sorting) {
    const sortCol = sort.origin ? `${sort.origin}(${sort.id})` : sort.id;
    query = query.order(sortCol, { ascending: !sort.desc });
  }

  if (!sorting.length) {
    query = query.order("start_date", { ascending: true });
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { items: data ?? [], total: count ?? 0 };
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useCourseSessions = (
  courseId: string,
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) => {
  return useQuery({
    queryKey: [...QUERY_KEY, courseId, sorting, filters],
    queryFn: () => fetchCourseSessions(courseId, sorting, filters),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });
};

const fetchOpenCourseSessions = async (
  sorting: SortRule[],
  filters: FilterRule[],
  courseId?: string,
): Promise<{ items: CourseSession[]; total: number }> => {
  let query = supabase
    .from("course_session")
    .select("*, course!inner(*)", { count: "exact" })
    .eq("is_open", true);

  if (courseId) {
    query = query.eq("course_id", courseId);
  }

  query = applyFilters(query, filters);

  for (const sort of sorting) {
    const sortCol = sort.origin ? `${sort.origin}(${sort.id})` : sort.id;
    query = query.order(sortCol, { ascending: !sort.desc });
  }

  if (!sorting.length) {
    query = query.order("start_date", { ascending: true });
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { items: data ?? [], total: count ?? 0 };
};

export const useOpenCourseSessions = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
  courseId?: string,
) => {
  return useQuery({
    queryKey: [...OPEN_SESSIONS_QUERY_KEY, courseId ?? "all", sorting, filters],
    queryFn: () => fetchOpenCourseSessions(sorting, filters, courseId),
    staleTime: 1000 * 60 * 5,
  });
};
