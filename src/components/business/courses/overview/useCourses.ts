import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { Course } from "@/types/Course";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = ["courses"];

// ─────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────

const fetchCourses = async (
  sorting: SortRule[],
  filters: FilterRule[],
): Promise<{ items: Course[]; total: number }> => {
  let query = supabase
    .from("course")
    .select("*, course_day(*, course_day_activity(*)), course_enrollment(*)", {
      count: "exact",
    });

  // ── Filters ──
  query = applyFilters(query, filters);

  // ── Sorting ──
  for (const sort of sorting) {
    query = query.order(sort.id, { ascending: !sort.desc });
  }
  if (!sorting.length) {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { items: data ?? [], total: count ?? 0 };
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useCourses = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) => {
  return useQuery({
    queryKey: [...QUERY_KEY, sorting, filters],
    queryFn: () => fetchCourses(sorting, filters),
    staleTime: 1000 * 60 * 5,
    select: ({ items, total }) => ({
      total,
      items: items.map((course) => {
        const { data } = supabase.storage
          .from("courses")
          .getPublicUrl(course.image_path);
        return { ...course, image_url: data.publicUrl };
      }),
    }),
  });
};
