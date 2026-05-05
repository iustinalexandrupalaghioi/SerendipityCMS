import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { useInfiniteTable } from "@/hooks/useInfiniteQuery";
import { supabase } from "@/lib/supabaseClient";
import type { CourseSession } from "@/types/Course";

export const QUERY_KEY = ["course-sessions"];
export const OPEN_SESSIONS_QUERY_KEY = ["course-sessions", "open"];

const PAGE_SIZE = 50;

// ─────────────────────────────────────────────
// useCourseSessions
// ─────────────────────────────────────────────

export const useCourseSessions = (
  courseId: string,
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) =>
  useInfiniteTable<CourseSession>({
    queryKey: [...QUERY_KEY, courseId, sorting, filters],
    pageSize: PAGE_SIZE,
    fetchPage: async (pageParam) => {
      const from = pageParam * PAGE_SIZE;

      let query = supabase
        .from("course_session")
        .select("*, course!inner(*)", { count: "exact" })
        .eq("course_id", courseId);

      query = applyFilters(query, filters);

      for (const sort of sorting) {
        const sortCol = sort.origin ? `${sort.origin}(${sort.id})` : sort.id;
        query = query.order(sortCol, { ascending: !sort.desc });
      }

      if (!sorting.length) {
        query = query.order("start_date", { ascending: true });
      }

      const { data, count, error } = await query.range(
        from,
        from + PAGE_SIZE - 1,
      );
      if (error) throw new Error(error.message);

      return {
        items: (data ?? []) as CourseSession[],
        total: count ?? 0,
        pageIndex: pageParam,
      };
    },
  });

// ─────────────────────────────────────────────
// useOpenCourseSessions
// ─────────────────────────────────────────────

export const useOpenCourseSessions = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
  courseId?: string,
) =>
  useInfiniteTable<CourseSession>({
    queryKey: [...OPEN_SESSIONS_QUERY_KEY, courseId ?? "all", sorting, filters],
    pageSize: PAGE_SIZE,
    fetchPage: async (pageParam) => {
      const from = pageParam * PAGE_SIZE;

      let query = supabase
        .from("course_session")
        .select("*, course!inner(*)", { count: "exact" })
        .eq("is_open", true);

      if (courseId) query = query.eq("course_id", courseId);

      query = applyFilters(query, filters);

      for (const sort of sorting) {
        const sortCol = sort.origin ? `${sort.origin}(${sort.id})` : sort.id;
        query = query.order(sortCol, { ascending: !sort.desc });
      }

      if (!sorting.length) {
        query = query.order("start_date", { ascending: true });
      }

      const { data, count, error } = await query.range(
        from,
        from + PAGE_SIZE - 1,
      );
      if (error) throw new Error(error.message);

      return {
        items: (data ?? []) as CourseSession[],
        total: count ?? 0,
        pageIndex: pageParam,
      };
    },
  });
