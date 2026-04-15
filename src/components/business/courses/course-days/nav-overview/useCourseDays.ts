import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { CourseDay } from "@/types/Course";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = ["course-days"];

// ─────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────

const fetchCourseDays = async (
  courseId: string,
  sorting: SortRule[],
  filters: FilterRule[],
): Promise<{ items: CourseDay[]; total: number }> => {
  let query = supabase
    .from("course_day")
    .select("*, course_day_activity(*)", { count: "exact" })
    .eq("course_id", courseId);

  // ── Filters ──
  query = applyFilters(query, filters);

  // ── Sorting ──
  for (const sort of sorting) {
    query = query.order(sort.id, { ascending: !sort.desc });
  }
  if (!sorting.length) {
    query = query.order("day_number", { ascending: true });
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { items: data ?? [], total: count ?? 0 };
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useCourseDays = (
  courseId: string,
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) => {
  return useQuery({
    queryKey: [...QUERY_KEY, courseId, sorting, filters],
    queryFn: () => fetchCourseDays(courseId, sorting, filters),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
    select: ({ items, total }) => ({
      total,
      items: items.map((day) => {
        const { data } = supabase.storage
          .from("courses")
          .getPublicUrl(day.image_path);
        return { ...day, image_url: data.publicUrl };
      }),
    }),
  });
};
