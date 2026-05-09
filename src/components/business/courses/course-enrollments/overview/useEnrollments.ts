import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { useInfiniteTable } from "@/hooks/useInfiniteQuery";
import { supabase } from "@/lib/supabaseClient";
import type { Enrollment } from "@/types/Course";
import { useQuery } from "@tanstack/react-query";

export const enrollmentKeys = {
  all: ["course_enrollments"] as const,
  list: (sorting: SortRule[], filters: FilterRule[], courseId?: string) =>
    [...enrollmentKeys.all, courseId ?? "all", sorting, filters] as const,
  enrollmentsCount: ["course_enrollments_count"] as const,
};
const PAGE_SIZE = 50;

export const useEnrollments = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
  courseId?: string,
) =>
  useInfiniteTable<Enrollment>({
    queryKey: enrollmentKeys.list(sorting, filters, courseId),
    pageSize: PAGE_SIZE,
    fetchPage: async (pageParam) => {
      const from = pageParam * PAGE_SIZE;

      let query = supabase
        .from("course_enrollment")
        .select(
          "*, course_session!inner(*, course!inner(*)), profile!inner(*)",
          {
            count: "exact",
          },
        );

      if (courseId) query = query.eq("course_session.course_id", courseId);

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
        items: (data ?? []) as Enrollment[],
        total: count ?? 0,
        pageIndex: pageParam,
      };
    },
  });

// ─────────────────────────────────────────────
// useCourseEnrollmentsCount
// ─────────────────────────────────────────────

const fetchCourseEnrollmentsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from("course_enrollment")
    .select("id", { count: "exact", head: true })
    .in("status", ["confirmed"]);

  if (error) {
    console.error("Error fetching course enrollments count:", error);
    throw new Error(error.message);
  }

  return count ?? 0;
};

export const useCourseEnrollmentsCount = () =>
  useQuery({
    queryKey: enrollmentKeys.enrollmentsCount,
    queryFn: fetchCourseEnrollmentsCount,
    staleTime: 1000 * 60 * 5,
  });
