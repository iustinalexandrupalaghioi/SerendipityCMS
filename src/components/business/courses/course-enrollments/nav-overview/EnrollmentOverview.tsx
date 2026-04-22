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
import type { Course, Enrollment } from "@/types/Course";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import AddCourseEnrollmentDialog from "../form/AddCourseEnrollmentDialog";
import { UpdateCourseEnrollmentDialog } from "../form/UpdateCourseEnrollmentDialog";
import {
  courseEnrollmentColumnVisibility,
  createCourseEnrollmentColumns,
} from "../overview/CourseEnrollmentColumns";
import { useEnrollments } from "../overview/useEnrollments";

export const COURSE_ENROLLMENT_KEY = "course-enrollment";

interface EnrollmentOverviewProps {
  course: Course;
  slotId?: string;
}

const EnrollmentOverview = ({ course, slotId }: EnrollmentOverviewProps) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(COURSE_ENROLLMENT_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(COURSE_ENROLLMENT_KEY),
  );

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null,
  );
  const [deletingEnrollment, setDeletingEnrollment] =
    useState<Enrollment | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data, error, isLoading } = useEnrollments(
    sorting,
    filters,
    course.id,
  );
  const enrollments = data?.items ?? [];
  const total = data?.total ?? 0;
  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteOpen = useCallback((rows: Row<Enrollment>[]) => {
    if (rows.length !== 1) return;
    setDeletingEnrollment(rows[0].original);
  }, []);

  const deleteEnrollment = useCallback(async () => {
    if (!deletingEnrollment) return;
    const { error } = await supabase
      .from("course_enrollment")
      .delete()
      .eq("id", deletingEnrollment.id);
    if (error) throw new Error("Failed to delete enrollment.");
  }, [deletingEnrollment]);

  // ── Open ──────────────────────────────────────────────────────────────────
  const handleOpen = useCallback((rows: Row<Enrollment>[]) => {
    const first = rows[0];
    if (first) setEditingEnrollment(first.original);
  }, []);

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => createCourseEnrollmentColumns(handleOpen, handleDeleteOpen),
    [handleOpen, handleDeleteOpen],
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const selectedRows = useMemo(
    () => enrollments.filter((row) => rowSelection[row.id]),
    [enrollments, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        slotId={slotId}
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        onAdd={course.is_open ? () => setAddOpen(true) : undefined}
        onDelete={(rows) =>
          handleDeleteOpen(
            rows.map((r) => ({ original: r }) as Row<Enrollment>),
          )
        }
        isDeleteEligible={() => selectedRows.length === 1}
        setRowSelection={setRowSelection}
      />

      <DataTable
        slotId={slotId}
        tableId={COURSE_ENROLLMENT_KEY}
        defaultViewName="Enrollments"
        isLoading={isLoading}
        data={enrollments}
        columns={columns}
        totalCount={total}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        initialColumnVisibility={courseEnrollmentColumnVisibility}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
        isFetchingNextPage={false}
        hasNextPage={false}
        fetchNextPage={() => {}}
        height={265}
      />

      {/* ── Dialogs ── */}
      {course.is_open && (
        <AddCourseEnrollmentDialog
          course={course}
          open={isAddOpen}
          setOpen={setAddOpen}
        />
      )}

      {editingEnrollment && (
        <UpdateCourseEnrollmentDialog
          open={!!editingEnrollment}
          setOpen={(o) => !o && setEditingEnrollment(null)}
          enrollment={editingEnrollment}
        />
      )}

      {deletingEnrollment && (
        <DeleteDialog
          open={!!deletingEnrollment}
          setOpen={(o) => !o && setDeletingEnrollment(null)}
          id={deletingEnrollment.id}
          title="Delete enrollment"
          target="course_enrollment"
          queryKeys={[["course_enrollments"]]}
          confirmationMessage={
            <>
              You're about to delete the course enrollment for{" "}
              <span className="font-semibold">
                {deletingEnrollment.profile?.first_name}{" "}
                {deletingEnrollment.profile?.last_name}
              </span>
              .<br /> Once deleted, the data cannot be recovered.
            </>
          }
          deleteFn={deleteEnrollment}
          onSuccess={() => setRowSelection({})}
        />
      )}
    </div>
  );
};

export default EnrollmentOverview;
