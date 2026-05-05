import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { useInfiniteTable } from "@/hooks/useInfiniteQuery";
import { supabase } from "@/lib/supabaseClient";
import type { Course, CourseDay } from "@/types/Course";
import { useQuery } from "@tanstack/react-query";

// ─────────────────────────────────────────────
// Query keys
// ─────────────────────────────────────────────

export const courseKeys = {
  all: ["courses"] as const,
  list: (sorting: SortRule[], filters: FilterRule[]) =>
    [...courseKeys.all, sorting, filters] as const,
  detail: (id: string) => ["course", id] as const,
};

const PAGE_SIZE = 50;

// ─────────────────────────────────────────────
// useCourses
// ─────────────────────────────────────────────

export const useCourses = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
) =>
  useInfiniteTable<Course>({
    queryKey: courseKeys.list(sorting, filters),
    pageSize: PAGE_SIZE,
    fetchPage: async (pageParam) => {
      const from = pageParam * PAGE_SIZE;

      let query = supabase.from("course").select("*", { count: "exact" });

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

      const items = (data ?? []).map((course) => {
        const { data: urlData } = supabase.storage
          .from("courses")
          .getPublicUrl(course.image_path);
        return { ...course, image_url: urlData.publicUrl };
      });

      return {
        items: items as Course[],
        total: count ?? 0,
        pageIndex: pageParam,
      };
    },
  });

// ─────────────────────────────────────────────
// useCourse
// ─────────────────────────────────────────────

const fetchCourse = async (id: string): Promise<Course> => {
  const { data, error } = await supabase
    .from("course")
    .select(
      "*, course_day(*, course_day_activity(*)), course_session(*, course_enrollment(*, profile(*)), course(*))",
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching course data:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useCourse = (id?: string) => {
  if (!id) throw new Error("Course ID is required");

  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => fetchCourse(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    select: (course: Course) => {
      const courseImage = course.image_path
        ? supabase.storage.from("courses").getPublicUrl(course.image_path).data
            .publicUrl
        : "";

      const courseDaysWithImages = course.course_day?.map((day: CourseDay) => {
        if (!day.image_path) return day;
        const { data } = supabase.storage
          .from("courses")
          .getPublicUrl(day.image_path);
        return { ...day, image_url: data.publicUrl };
      });

      return {
        ...course,
        image_url: courseImage,
        course_day: courseDaysWithImages,
      };
    },
  });
};
