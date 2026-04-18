import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import { Toolbar } from "@/components/toolbar/Toolbar";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import type { Course, CourseDay } from "@/types/Course";
import { supabase } from "@/lib/supabaseClient";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  courseDayColumnVisibility,
  createCourseDayColumns,
} from "./CourseDayColumns";
import { useCourseDays, QUERY_KEY } from "./useCourseDays";

export const COURSE_DAYS_OVERVIEW_KEY = "course-days-overview";

interface CourseDayOverviewProps {
  course: Course;
  slotId?: string;
}

const CourseDayOverview = ({ course, slotId }: CourseDayOverviewProps) => {
  const navigate = useNavigate();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(COURSE_DAYS_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(COURSE_DAYS_OVERVIEW_KEY),
  );

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [deletingCourseDay, setDeletingCourseDay] = useState<CourseDay | null>(
    null,
  );

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useCourseDays(
    course.id,
    sorting,
    filters,
  );
  const courseDays = data?.items ?? [];
  const total = data?.total ?? 0;

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteOpen = useCallback((rows: Row<CourseDay>[]) => {
    if (rows.length !== 1) return;
    setDeletingCourseDay(rows[0].original);
  }, []);

  const deleteCourseDay = useCallback(async () => {
    if (!deletingCourseDay) return;

    const { data: day, error: fetchError } = await supabase
      .from("course_day")
      .select("image_path")
      .eq("id", deletingCourseDay.id)
      .single();

    if (fetchError || !day) throw new Error("Failed to fetch course day.");

    if (day.image_path) {
      const { error } = await supabase.storage
        .from("courses")
        .remove([day.image_path]);
      if (error) throw new Error("Failed to delete course day image.");
    }

    const { error } = await supabase
      .from("course_day")
      .delete()
      .eq("id", deletingCourseDay.id);
    if (error) throw new Error("Failed to delete course day.");
  }, [deletingCourseDay]);

  // ── Open ──────────────────────────────────────────────────────────────────
  const handleOpen = useCallback(
    (rows: Row<CourseDay>[]) => {
      const first = rows[0];
      if (first)
        navigate(
          `/courses/update/${course.id}/course-days/update/${first.original.id}`,
        );
    },
    [navigate, course.id],
  );

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => createCourseDayColumns(course.id, handleOpen, handleDeleteOpen),
    [course.id, handleOpen, handleDeleteOpen],
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const selectedRows = useMemo(
    () => courseDays.filter((row) => rowSelection[row.id]),
    [courseDays, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading course days</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        slotId={slotId}
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        actions={[]}
        onDelete={(rows) =>
          handleDeleteOpen(rows.map((r) => ({ original: r }) as Row<CourseDay>))
        }
        isDeleteEligible={() => selectedRows.length === 1}
        addPath={`/courses/update/${course.id}/course-days/add`}
        setRowSelection={setRowSelection}
      />

      <DataTable
        slotId={slotId}
        isLoading={isLoading}
        defaultViewName="Course days"
        tableId={COURSE_DAYS_OVERVIEW_KEY}
        isFetchingNextPage={false}
        hasNextPage={false}
        fetchNextPage={() => {}}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        totalCount={total}
        columns={columns}
        initialColumnVisibility={courseDayColumnVisibility}
        data={courseDays}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
        height={265}
      />

      {deletingCourseDay && (
        <DeleteDialog
          open={!!deletingCourseDay}
          setOpen={(open) => !open && setDeletingCourseDay(null)}
          id={deletingCourseDay.id}
          title="Delete course day"
          target="course_day"
          queryKeys={[QUERY_KEY, ["course", course.id]]}
          confirmationMessage={
            <>
              You're about to delete{" "}
              <span className="font-semibold">"{deletingCourseDay.title}"</span>
              .
              <br />
              Once deleted, the data cannot be recovered.
            </>
          }
          deleteFn={deleteCourseDay}
          onSuccess={() => setRowSelection({})}
        />
      )}
    </div>
  );
};

export default CourseDayOverview;
