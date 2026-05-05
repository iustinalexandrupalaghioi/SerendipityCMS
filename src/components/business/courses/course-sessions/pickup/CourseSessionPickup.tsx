import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import ActionDialog from "@/components/partials/dialog/ActionDialog";
import type { Course, CourseSession } from "@/types/Course";
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useOpenCourseSessions } from "../nav-overview/useCourseSessions";
import {
  createPickupCourseSessionColumns,
  pickupCourseSessionColumnVisibility,
} from "./CourseSessionPickupColumns";

export const PICKUP_COURSE_SESSION_KEY = "pickup-course-session";

interface CourseSessionPickupProps {
  course: Course;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (session: CourseSession) => void;
}

const CourseSessionPickup = ({
  course,
  open,
  setOpen,
  onSelect,
}: CourseSessionPickupProps) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(PICKUP_COURSE_SESSION_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(PICKUP_COURSE_SESSION_KEY),
  );

  const {
    allItems: sessions,
    total,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useOpenCourseSessions(sorting, filters, course?.id);

  const handleSelect = useCallback(
    (session: CourseSession) => {
      onSelect(session);
      setOpen(false);
    },
    [onSelect, setOpen],
  );

  const columns = useMemo(
    () => createPickupCourseSessionColumns(handleSelect),
    [handleSelect],
  );

  const handleFiltersChange = useCallback((newFilters: FilterRule[]) => {
    setFilters(newFilters);
    setRowSelection({});
  }, []);

  return (
    <ActionDialog
      open={open}
      setOpen={setOpen}
      title="Select session"
      description="Select a session from the list"
      className="md:max-w-5xl max-w-screen max-h-[80vh] md:max-h-[90vh] overflow-y-auto px-1 md:px-4"
      isPending={isLoading}
      showFooter={false}
    >
      {isError ? (
        <div>Error loading course sessions</div>
      ) : (
        <div className="flex flex-1 min-h-0 w-full min-w-0 flex-col">
          <DataTable
            tableId={PICKUP_COURSE_SESSION_KEY}
            defaultViewName="Sessions"
            isLoading={isLoading}
            data={sessions}
            columns={columns}
            totalCount={total}
            getRowId={(row) => row.id}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            initialColumnVisibility={pickupCourseSessionColumnVisibility}
            onSortingChange={setSorting}
            onFiltersChange={handleFiltersChange}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            height={450}
          />
        </div>
      )}
    </ActionDialog>
  );
};

export default CourseSessionPickup;
