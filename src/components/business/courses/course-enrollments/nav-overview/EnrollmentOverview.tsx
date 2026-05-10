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
import { enrollmentKeys, useEnrollments } from "../overview/useEnrollments";
import { useEnrollmentActions } from "../overview/useEnrollmentsActions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const COURSE_ENROLLMENT_KEY = "course-enrollment";

interface EnrollmentOverviewProps {
  course: Course;
  slotId?: string;
  isOpen?: boolean;
}

const EnrollmentOverview = ({
  course,
  slotId,
  isOpen,
}: EnrollmentOverviewProps) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(COURSE_ENROLLMENT_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(COURSE_ENROLLMENT_KEY),
  );
  const queryClient = useQueryClient();
  // ── Dialog state ──────────────────────────────────────────────────────────
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null,
  );
  const [deletingEnrollment, setDeletingEnrollment] =
    useState<Enrollment | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    allItems: enrollments,
    total,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useEnrollments(sorting, filters, course.id);

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

  const handleComplete = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("course_enrollment")
          .update({ status: "completed" })
          .eq("id", id);
        if (error) throw error;
        toast.success("Course enrollment successfully completed.");
        queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
        queryClient.invalidateQueries({
          queryKey: enrollmentKeys.enrollmentsCount,
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to complete course enrollment.");
      }
    },
    [queryClient],
  );

  const handleNoShow = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("course_enrollment")
          .update({ status: "no_show" })
          .eq("id", id);
        if (error) throw error;
        toast.success("Course enrollment successfully marked as 'No show'.");
        queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
        queryClient.invalidateQueries({
          queryKey: enrollmentKeys.enrollmentsCount,
        });
      } catch (error: any) {
        toast.error(
          error.message || "Failed to mark course enrollment as 'No show'.",
        );
      }
    },
    [queryClient],
  );

  const actions = useEnrollmentActions({
    onComplete: handleComplete,
    onNoShow: handleNoShow,
  });

  // ── Open ──────────────────────────────────────────────────────────────────
  const handleOpen = useCallback((rows: Row<Enrollment>[]) => {
    const first = rows[0];
    if (first) setEditingEnrollment(first.original);
  }, []);

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => createCourseEnrollmentColumns(handleOpen, handleDeleteOpen, actions),
    [handleOpen, handleDeleteOpen, actions],
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

  if (isError) return <div>Error loading course enrollments</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        slotId={slotId}
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        onAdd={() => setAddOpen(true)}
        onDelete={(rows) =>
          handleDeleteOpen(
            rows.map((r) => ({ original: r }) as Row<Enrollment>),
          )
        }
        actions={actions.map((a) => ({
          label: a.label,
          isEligible: (row: Enrollment) =>
            a.isEligible?.({ original: row } as Row<Enrollment>) ?? true,
          onSelect: (rows: Enrollment[]) =>
            a.onSelect(rows.map((r) => ({ original: r }) as Row<Enrollment>)),
        }))}
        isDeleteEligible={() =>
          selectedRows.length === 1 &&
          ["completed", "cancelled", "declined"].includes(
            selectedRows[0].status,
          )
        }
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
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        height={isOpen ? 400 : undefined}
      />

      {/* ── Dialogs ── */}

      <AddCourseEnrollmentDialog
        course={course}
        open={isAddOpen}
        setOpen={setAddOpen}
      />

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
          queryKeys={[enrollmentKeys.all, enrollmentKeys.enrollmentsCount]}
          confirmationMessage={
            <>
              You're about to delete the course enrollment for{" "}
              <span className="font-semibold">
                {deletingEnrollment.profile?.full_name}{" "}
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
