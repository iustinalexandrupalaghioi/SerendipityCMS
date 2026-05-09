import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Toolbar } from "@/components/toolbar/Toolbar";
import type { CourseDay, CourseDayActivity } from "@/types/Course";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import AddCourseDayActivityDialog from "../form/AddCourseDayActivityDialog";
import { UpdateCourseDayActivityDialog } from "../form/UpdateCourseDayActivityDialog";
import {
  courseDayActivityColumnVisibility,
  createCourseDayActivityColumns,
} from "./ActivityColumns";
import { activityKeys, useCourseDayActivities } from "./useDayActivities";
import { courseDayKeys } from "../../nav-overview/useCourseDays";
import { courseKeys } from "../../../overview/useCourses";

export const COURSE_DAY_ACTIVITIES_OVERVIEW_KEY =
  "course-day-activities-overview";

interface CourseDayActivitiesOverviewProps {
  courseDay: CourseDay;
  slotId?: string;
  isOpen?: boolean;
}

const CourseDayActivitiesOverview = ({
  courseDay,
  slotId,
  isOpen,
}: CourseDayActivitiesOverviewProps) => {
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(COURSE_DAY_ACTIVITIES_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(COURSE_DAY_ACTIVITIES_OVERVIEW_KEY),
  );

  const { data, isLoading, isError } = useCourseDayActivities(
    sorting,
    filters,
    courseDay.id,
  );
  const activities = data?.items ?? [];
  const total = data?.total ?? 0;

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [editingActivity, setEditingActivity] =
    useState<CourseDayActivity | null>(null);
  const [deletingActivity, setDeletingActivity] =
    useState<CourseDayActivity | null>(null);
  const [isAddOpen, setAddOpen] = useState(false);

  // ── Open (edit) ───────────────────────────────────────────────────────────
  const handleOpen = useCallback((rows: Row<CourseDayActivity>[]) => {
    const first = rows[0];
    if (first) setEditingActivity(first.original);
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteOpen = useCallback((rows: Row<CourseDayActivity>[]) => {
    if (rows.length !== 1) return;
    setDeletingActivity(rows[0].original);
  }, []);

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => createCourseDayActivityColumns(handleOpen, handleDeleteOpen),
    [handleOpen, handleDeleteOpen],
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const selectedRows = useMemo(
    () => activities.filter((row) => rowSelection[row.id]),
    [activities, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading course day activities</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        slotId={slotId}
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        onAdd={() => setAddOpen(true)}
        onDelete={(rows) =>
          handleDeleteOpen(
            rows.map((r) => ({ original: r }) as Row<CourseDayActivity>),
          )
        }
        isDeleteEligible={() => selectedRows.length === 1}
        setRowSelection={setRowSelection}
      />

      <DataTable
        slotId={slotId}
        isLoading={isLoading}
        defaultViewName="Activities"
        tableId={COURSE_DAY_ACTIVITIES_OVERVIEW_KEY}
        isFetchingNextPage={false}
        hasNextPage={false}
        fetchNextPage={() => {}}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        totalCount={total}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
        columns={columns}
        initialColumnVisibility={courseDayActivityColumnVisibility}
        data={activities}
        height={isOpen ? 400 : undefined}
      />

      {/* ── Dialogs ── */}
      <AddCourseDayActivityDialog open={isAddOpen} setOpen={setAddOpen} />

      {editingActivity && (
        <UpdateCourseDayActivityDialog
          open={!!editingActivity}
          setOpen={(open) => !open && setEditingActivity(null)}
          activity={editingActivity}
          course_day={courseDay}
        />
      )}

      {deletingActivity && (
        <DeleteDialog
          open={!!deletingActivity}
          setOpen={(open) => !open && setDeletingActivity(null)}
          id={deletingActivity.id}
          title="Delete activity"
          target="course_day_activity"
          queryKeys={[
            activityKeys.all,
            courseDayKeys.all,
            courseKeys.all,
            courseKeys.detail(courseDay.course_id),
          ]}
          confirmationMessage={
            <>
              You're about to delete{" "}
              <span className="font-semibold">
                "{deletingActivity.activity}"
              </span>
              .
              <br />
              Once deleted, the data cannot be recovered.
            </>
          }
          onSuccess={() => setRowSelection({})}
        />
      )}
    </div>
  );
};

export default CourseDayActivitiesOverview;
