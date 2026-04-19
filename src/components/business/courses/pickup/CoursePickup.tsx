import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import ActionDialog from "@/components/partials/dialog/ActionDialog";
import type { Course } from "@/types/Course";
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useCourses } from "../overview/useCourses";
import {
  createPickupCourseColumns,
  pickupCourseColumnVisibility,
} from "./CoursePickupColumns";

export const PICKUP_COURSE_KEY = "pickup-course";

const OPEN_COURSE_FILTER: FilterRule[] = [
  {
    columnId: "is_open",
    columnType: "boolean",
    columnName: "Open",
    operator: "is_true",
    value: null,
  },
];

interface CoursePickupProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (course: Course) => void;
}

const CoursePickup = ({ open, setOpen, onSelect }: CoursePickupProps) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(PICKUP_COURSE_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() => {
    const saved = initialFilters(PICKUP_COURSE_KEY);
    const hasOpenFilter = saved.some((f) => f.columnId === "is_open");
    return hasOpenFilter ? saved : [...OPEN_COURSE_FILTER, ...saved];
  });

  const { data, isLoading, isError } = useCourses(sorting, filters);

  const courses = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleSelect = useCallback(
    (course: Course) => {
      onSelect(course);
      setOpen(false);
    },
    [onSelect, setOpen],
  );

  const columns = useMemo(
    () => createPickupCourseColumns(handleSelect),
    [handleSelect],
  );

  const handleFiltersChange = useCallback((newFilters: FilterRule[]) => {
    // Always keep the is_open pre-filter
    const hasOpenFilter = newFilters.some((f) => f.columnId === "is_open");
    setFilters(
      hasOpenFilter ? newFilters : [...OPEN_COURSE_FILTER, ...newFilters],
    );
    setRowSelection({});
  }, []);

  return (
    <ActionDialog
      open={open}
      setOpen={setOpen}
      title="Select course"
      description="Select a course from the list"
      className="md:max-w-7xl max-w-screen max-h-[80vh] md:max-h-[90vh] overflow-y-auto  px-1 md:px-4"
      isPending={isLoading}
      showFooter={false}
    >
      {isError ? (
        <div>Error loading courses</div>
      ) : (
        <div className="flex flex-1 min-h-0 w-full min-w-0 flex-col">
          <DataTable
            tableId={PICKUP_COURSE_KEY}
            defaultViewName="Courses"
            isLoading={isLoading}
            data={courses}
            columns={columns}
            totalCount={total}
            getRowId={(row) => row.id}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            initialColumnVisibility={pickupCourseColumnVisibility}
            onSortingChange={setSorting}
            onFiltersChange={handleFiltersChange}
            isFetchingNextPage={false}
            hasNextPage={false}
            fetchNextPage={() => {}}
            height={450}
          />
        </div>
      )}
    </ActionDialog>
  );
};

export default CoursePickup;
