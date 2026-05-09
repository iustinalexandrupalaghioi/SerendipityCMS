import {
  applyFilters,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import { supabase } from "@/lib/supabaseClient";
import type { CourseDayActivity } from "@/types/Course";
import { useQuery } from "@tanstack/react-query";

export const activityKeys = {
  all: ["course-day-activities"] as const,
  byDay: (
    courseDayId: string | undefined,
    sorting: SortRule[],
    filters: FilterRule[],
  ) =>
    ["course-day-activities", courseDayId ?? "all", sorting, filters] as const,
};

const fetchCourseDayActivities = async (
  sorting: SortRule[],
  filters: FilterRule[],
  courseDayId: string | undefined,
): Promise<{ items: CourseDayActivity[]; total: number }> => {
  let query = supabase
    .from("course_day_activity")
    .select("*", { count: "exact" });

  if (courseDayId) query = query.eq("course_day_id", courseDayId);

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

export const useCourseDayActivities = (
  sorting: SortRule[] = [],
  filters: FilterRule[] = [],
  courseDayId?: string,
) => {
  return useQuery({
    queryKey: activityKeys.byDay(courseDayId, sorting, filters),
    queryFn: () => fetchCourseDayActivities(sorting, filters, courseDayId),
    staleTime: 1000 * 60 * 5,
  });
};
