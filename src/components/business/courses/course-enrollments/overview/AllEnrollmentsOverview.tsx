import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import Breadcrumb from "@/components/partials/Breadcrumb";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { supabase } from "@/lib/supabaseClient";
import type { Enrollment } from "@/types/Course";
import { useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import AddCourseEnrollmentDialog from "../form/AddCourseEnrollmentDialog";
import { UpdateCourseEnrollmentDialog } from "../form/UpdateCourseEnrollmentDialog";
import {
  courseEnrollmentColumnVisibility,
  createCourseEnrollmentColumns,
} from "./CourseEnrollmentColumns";
import { enrollmentKeys, useEnrollments } from "./useEnrollments";
import { useEnrollmentActions } from "./useEnrollmentsActions";

export const ENROLLMENT_LIST_KEY = "enrollment-list";

const LABEL_MAP: Record<string, string> = {
  enrollments: "Enrollments",
  submitted: "Submitted",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

const AllEnrollmentsOverview = () => {
  const { status } = useParams();
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(ENROLLMENT_LIST_KEY),
  );

  // ── Pre-filters (locked, from URL) ────────────────────────────────────────
  const preFilters = useMemo<FilterRule[]>(() => {
    if (!status) return [];
    return [
      {
        columnId: "status",
        columnType: "select",
        columnName: "Status",
        operator: "equals",
        value: status,
      },
    ];
  }, [status]);

  // ── User filters (editable) ───────────────────────────────────────────────
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(ENROLLMENT_LIST_KEY),
  );

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
  } = useEnrollments(sorting, [...preFilters, ...filters]);

  const breadcrumbItems = useMemo(() => {
    const pathnames = location.pathname.split("/").filter(Boolean);

    const crumbs = pathnames.map((segment, index) => {
      const path = "/" + pathnames.slice(0, index + 1).join("/");

      return {
        path,
        label:
          LABEL_MAP[segment] ??
          segment.charAt(0).toUpperCase() + segment.slice(1),
      };
    });

    return [{ path: "/", label: "Home" }, ...crumbs];
  }, [location.pathname]);

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
    if (error) throw new Error(error.message || "Failed to delete enrollment.");
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

  const actions = useEnrollmentActions({
    onComplete: handleComplete,
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

  const handleFiltersChange = useCallback((newFilters: FilterRule[]) => {
    setFilters(newFilters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading enrollments</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Breadcrumb items={breadcrumbItems} />
      <Toolbar
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
        tableId={ENROLLMENT_LIST_KEY}
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
        preFilters={preFilters}
      />

      {/* ── Dialogs ── */}
      <AddCourseEnrollmentDialog open={isAddOpen} setOpen={setAddOpen} />

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
                {deletingEnrollment.profile?.full_name}
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

export default AllEnrollmentsOverview;
