import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import ActionDialog from "@/components/partials/dialog/ActionDialog";
import type { Category } from "@/types/Category";
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useCategories } from "../overview/useCategories";
import {
  createPickupCategoryColumns,
  pickupCategoryColumnVisibility,
} from "./CategoryPickupColumns";

export const PICKUP_CATEGORY_KEY = "pickup-category";

interface CategoryPickupProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (category: Category) => void;
}

const CategoryPickup = ({ open, setOpen, onSelect }: CategoryPickupProps) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(PICKUP_CATEGORY_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(PICKUP_CATEGORY_KEY),
  );

  const { data, isLoading, isError } = useCategories(sorting, filters);

  const categories = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleSelect = useCallback(
    (category: Category) => {
      onSelect(category);
      setOpen(false);
    },
    [onSelect, setOpen],
  );

  const columns = useMemo(
    () => createPickupCategoryColumns(handleSelect),
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
      title="Categories"
      description="Select a category from the list"
      className="md:max-w-3xl max-w-screen max-h-[80vh] md:max-h-[90vh] overflow-y-auto"
      isPending={isLoading}
      showFooter={false}
    >
      {isError ? (
        <div>Error loading categories</div>
      ) : (
        <div className="flex flex-1 min-h-0 w-full flex-col">
          <DataTable
            tableId={PICKUP_CATEGORY_KEY}
            defaultViewName="Categories"
            isLoading={isLoading}
            data={categories}
            columns={columns}
            totalCount={total}
            getRowId={(row) => row.id}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            initialColumnVisibility={pickupCategoryColumnVisibility}
            onSortingChange={setSorting}
            onFiltersChange={handleFiltersChange}
            isFetchingNextPage={false}
            hasNextPage={false}
            fetchNextPage={() => {}}
            height={550}
          />
        </div>
      )}
    </ActionDialog>
  );
};

export default CategoryPickup;
