import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { CourseDay } from "@/types/Course";
import { useQuery } from "@tanstack/react-query";

export const courseDayKeys = {
  all: ["course-days"] as const,
  list: (courseId: string, sorting: SortRule[], filters: FilterRule[]) =>
    [...courseDayKeys.all, courseId, sorting, filters] as const,
  detail: (id: string) => ["course-day", id] as const,
};

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
    const sortCol = sort.origin ? `${sort.origin}(${sort.id})` : sort.id;
    query = query.order(sortCol, { ascending: !sort.desc });
  }

  if (!sorting.length) {
    query = query.order("day_number", { ascending: true });
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { items: data ?? [], total: count ?? 0 };
};

export const useCourseDays = (
  courseId: string,
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) => {
  return useQuery({
    queryKey: courseDayKeys.list(courseId, sorting, filters),
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

const fetchCourseDay = async (id: string): Promise<CourseDay> => {
  const { data, error } = await supabase
    .from("course_day")
    .select(
      `
      *,
      course (*),
      course_day_activity (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching course day data:", error);
    throw new Error(error.message);
  }

  return data;
};

export const useCourseDay = (id?: string) => {
  return useQuery({
    queryKey: courseDayKeys.detail(id!),
    queryFn: () => fetchCourseDay(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    select: (courseDay: CourseDay) => {
      if (!courseDay.image_path) {
        return { ...courseDay, image_url: "" };
      }

      const { data } = supabase.storage
        .from("courses")
        .getPublicUrl(courseDay.image_path);

      return {
        ...courseDay,
        image_url: data.publicUrl,
      };
    },
  });
};
