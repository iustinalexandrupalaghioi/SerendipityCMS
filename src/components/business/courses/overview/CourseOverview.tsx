import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import { Toolbar } from "@/components/toolbar/Toolbar";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import type { Course } from "@/types/Course";
import { supabase } from "@/lib/supabaseClient";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { courseColumnVisibility, createCourseColumns } from "./CourseColumns";
import { useCourses, QUERY_KEY } from "./useCourses";
import { useCourseActions } from "./useCourseActions";
import OpenCourseEnrollmentDialog from "../actions/OpenCourseEnrollmentDialog";
import CloseCourseEnrollmentDialog from "../actions/CloseCourseEnrollmentsDialog";

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
  const [openEnrollmentCourse, setOpenEnrollmentCourse] =
    useState<Course | null>(null);
  const [closeEnrollmentCourse, setCloseEnrollmentCourse] =
    useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useCourses(sorting, filters);
  const courses = data?.items ?? [];
  const total = data?.total ?? 0;

  // ── Actions ───────────────────────────────────────────────────────────────
  const actions = useCourseActions({
    setOpenEnrollmentCourse,
    setCloseEnrollmentCourse,
  });

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteOpen = useCallback((rows: Row<Course>[]) => {
    if (rows.length !== 1) return;
    setDeletingCourse(rows[0].original);
  }, []);

  const deleteCourse = useCallback(async () => {
    if (!deletingCourse) return;

    const { data: course, error: fetchError } = await supabase
      .from("course")
      .select("image_path, course_day(image_path, id)")
      .eq("id", deletingCourse.id)
      .single();

    if (fetchError || !course) throw new Error("Failed to fetch course.");

    if (course.course_day?.length) {
      const paths = course.course_day
        .filter((day) => day.image_path)
        .map((day) => day.image_path!);
      if (paths.length) {
        const { error } = await supabase.storage.from("courses").remove(paths);
        if (error) throw new Error("Failed to delete course day images.");
      }
    }

    if (course.image_path) {
      const { error } = await supabase.storage
        .from("courses")
        .remove([course.image_path]);
      if (error) throw new Error("Failed to delete course image.");
    }

    const { error } = await supabase
      .from("course")
      .delete()
      .eq("id", deletingCourse.id);
    if (error) throw new Error("Failed to delete course.");
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
    () => createCourseColumns(handleOpen, handleDeleteOpen, actions),
    [handleOpen, handleDeleteOpen, actions],
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
        actions={actions.map((a) => ({
          label: a.label,
          isEligible: (row: Course) =>
            a.isEligible?.({ original: row } as Row<Course>) ?? true,
          onSelect: (rows: Course[]) =>
            a.onSelect(rows.map((r) => ({ original: r }) as Row<Course>)),
        }))}
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
        isFetchingNextPage={false}
        hasNextPage={false}
        fetchNextPage={() => {}}
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

      {/* ── Dialogs ── */}
      {openEnrollmentCourse && (
        <OpenCourseEnrollmentDialog
          open={!!openEnrollmentCourse}
          setOpen={(open) => !open && setOpenEnrollmentCourse(null)}
          course={openEnrollmentCourse}
        />
      )}

      {closeEnrollmentCourse && (
        <CloseCourseEnrollmentDialog
          open={!!closeEnrollmentCourse}
          setOpen={(open) => !open && setCloseEnrollmentCourse(null)}
          courseId={closeEnrollmentCourse.id}
          courseTitle={closeEnrollmentCourse.title}
        />
      )}

      {deletingCourse && (
        <DeleteDialog
          open={!!deletingCourse}
          setOpen={(open) => !open && setDeletingCourse(null)}
          id={deletingCourse.id}
          title="Delete Course"
          target="course"
          queryKeys={[QUERY_KEY]}
          confirmationMessage={
            <>
              You're about to delete{" "}
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
