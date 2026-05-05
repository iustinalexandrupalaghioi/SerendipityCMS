import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { supabase } from "@/lib/supabaseClient";
import type { Course } from "@/types/Course";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { courseColumnVisibility, createCourseColumns } from "./CourseColumns";
import { courseKeys, useCourses } from "./useCourses";

export const COURSES_OVERVIEW_KEY = "courses-overview";

const CoursesOverview = () => {
  const navigate = useNavigate();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(COURSES_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(COURSES_OVERVIEW_KEY),
  );

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    allItems: courses,
    total,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useCourses(sorting, filters);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteOpen = useCallback((rows: Row<Course>[]) => {
    if (rows.length !== 1) return;
    setDeletingCourse(rows[0].original);
  }, []);

  const deleteCourse = useCallback(async () => {
    if (!deletingCourse) return;

    const { error } = await supabase
      .from("course")
      .delete()
      .eq("id", deletingCourse.id);

    if (error) {
      throw new Error(error.message || "Failed to update course session.");
    }
  }, [deletingCourse]);

  // ── Open ──────────────────────────────────────────────────────────────────
  const handleOpen = useCallback(
    (rows: Row<Course>[]) => {
      const first = rows[0];
      if (first) navigate(`/courses/update/${first.original.id}`);
    },
    [navigate],
  );

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => createCourseColumns(handleOpen, handleDeleteOpen),
    [handleOpen, handleDeleteOpen],
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const selectedRows = useMemo(
    () => courses.filter((row) => rowSelection[row.id]),
    [courses, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading courses</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        onDelete={(rows) =>
          handleDeleteOpen(rows.map((r) => ({ original: r }) as Row<Course>))
        }
        isDeleteEligible={() => selectedRows.length === 1}
        addPath="/courses/add"
        setRowSelection={setRowSelection}
      />

      <DataTable
        isLoading={isLoading}
        defaultViewName="Courses"
        tableId={COURSES_OVERVIEW_KEY}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        totalCount={total}
        columns={columns}
        initialColumnVisibility={courseColumnVisibility}
        data={courses}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
      />

      {deletingCourse && (
        <DeleteDialog
          open={!!deletingCourse}
          setOpen={(open) => !open && setDeletingCourse(null)}
          id={deletingCourse.id}
          title="Delete course"
          target="course"
          queryKeys={[courseKeys.all]}
          confirmationMessage={
            <>
              You're about to delete the course{" "}
              <span className="font-semibold">"{deletingCourse.title}"</span>.
              <br />
              Once deleted, the data cannot be recovered.
            </>
          }
          deleteFn={deleteCourse}
          onSuccess={() => setRowSelection({})}
        />
      )}
    </div>
  );
};

export default CoursesOverview;
