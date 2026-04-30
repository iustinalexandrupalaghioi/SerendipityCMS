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
import type { Course, CourseSession } from "@/types/Course";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { AddCourseSessionDialog } from "../form/AddCourseSessionDialog";
import { UpdateCourseSessionDialog } from "../form/UpdateCourseSessionDialog";
import {
  courseSessionColumnVisibility,
  createCourseSessionColumns,
} from "./CourseSessionColumns";
import { useCourseSessions, QUERY_KEY } from "./useCourseSessions";
import { format } from "date-fns/format";

export const COURSE_SESSIONS_OVERVIEW_KEY = "course-sessions-overview";

interface CourseSessionOverviewProps {
  course: Course;
  slotId?: string;
  isOpen?: boolean;
}

const CourseSessionOverview = ({
  course,
  slotId,
  isOpen,
}: CourseSessionOverviewProps) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(COURSE_SESSIONS_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(COURSE_SESSIONS_OVERVIEW_KEY),
  );

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CourseSession | null>(
    null,
  );
  const [deletingSession, setDeletingSession] = useState<CourseSession | null>(
    null,
  );

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useCourseSessions(
    course.id,
    sorting,
    filters,
  );
  const sessions = data?.items ?? [];
  const total = data?.total ?? 0;

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteOpen = useCallback((rows: Row<CourseSession>[]) => {
    if (rows.length !== 1) return;
    setDeletingSession(rows[0].original);
  }, []);

  const deleteSession = useCallback(async () => {
    if (!deletingSession) return;
    const { error } = await supabase
      .from("course_session")
      .delete()
      .eq("id", deletingSession.id);
    if (error) throw new Error("Failed to delete course session.");
  }, [deletingSession]);

  // ── Open ──────────────────────────────────────────────────────────────────
  const handleOpen = useCallback((rows: Row<CourseSession>[]) => {
    const first = rows[0];
    if (first) setEditingSession(first.original);
  }, []);

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => createCourseSessionColumns(handleOpen, handleDeleteOpen),
    [handleOpen, handleDeleteOpen],
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const selectedRows = useMemo(
    () => sessions.filter((row) => rowSelection[row.id]),
    [sessions, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading course sessions</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        slotId={slotId}
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        actions={[]}
        onAdd={() => setAddOpen(true)}
        onDelete={(rows) =>
          handleDeleteOpen(
            rows.map((r) => ({ original: r }) as Row<CourseSession>),
          )
        }
        isDeleteEligible={() => selectedRows.length === 1}
        setRowSelection={setRowSelection}
      />

      <DataTable
        slotId={slotId}
        isLoading={isLoading}
        defaultViewName="Course sessions"
        tableId={COURSE_SESSIONS_OVERVIEW_KEY}
        isFetchingNextPage={false}
        hasNextPage={false}
        fetchNextPage={() => {}}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        totalCount={total}
        columns={columns}
        initialColumnVisibility={courseSessionColumnVisibility}
        data={sessions}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
        height={isOpen ? 400 : undefined}
      />

      {/* ── Dialogs ── */}
      <AddCourseSessionDialog
        course={course}
        open={isAddOpen}
        setOpen={setAddOpen}
      />

      {editingSession && (
        <UpdateCourseSessionDialog
          open={!!editingSession}
          setOpen={(o) => !o && setEditingSession(null)}
          session={editingSession}
        />
      )}

      {deletingSession && (
        <DeleteDialog
          open={!!deletingSession}
          setOpen={(o) => !o && setDeletingSession(null)}
          id={deletingSession.id}
          title="Delete course session"
          target="course_session"
          queryKeys={[QUERY_KEY, ["course", course.id]]}
          confirmationMessage={
            <>
              You're about to delete the session starting on{" "}
              <span className="font-semibold">
                {format(new Date(deletingSession.start_date), "dd-MM-yyyy")}
              </span>
              .<br />
              Once deleted, the data cannot be recovered.
            </>
          }
          deleteFn={deleteSession}
          onSuccess={() => setRowSelection({})}
        />
      )}
    </div>
  );
};

export default CourseSessionOverview;
