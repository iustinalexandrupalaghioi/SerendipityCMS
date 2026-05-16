import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import ActionDialog from "@/components/partials/dialog/ActionDialog";
import type { Profile } from "@/types/User";
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  createPickupUserColumns,
  pickupUserColumnVisibility,
} from "./UserPickupColumns";
import { useUserProfiles } from "../overview/useUserProfiles";

export const PICKUP_USER_KEY = "pickup-user";

interface UserPickupProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (user: Profile) => void;
}

const UserPickup = ({ open, setOpen, onSelect }: UserPickupProps) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(PICKUP_USER_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(PICKUP_USER_KEY),
  );

  const {
    allItems: users,
    total,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useUserProfiles(sorting, filters);

  const handleSelect = useCallback(
    (user: Profile) => {
      onSelect(user);
      setOpen(false);
    },
    [onSelect, setOpen],
  );

  const columns = useMemo(
    () => createPickupUserColumns(handleSelect),
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
      title="Select customer"
      description="Select a customer from the list"
      className="md:max-w-4xl max-h-[80vh] md:max-h-[90vh] overflow-y-auto  px-1 md:px-4"
      isPending={isLoading}
      showFooter={false}
    >
      {isError ? (
        <div>Error loading users</div>
      ) : (
        <div className="flex flex-1 min-h-0 w-full flex-col min-w-0">
          <DataTable
            tableId={PICKUP_USER_KEY}
            defaultViewName="Customers"
            isLoading={isLoading}
            data={users}
            columns={columns}
            totalCount={total}
            getRowId={(row) => row.id}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            initialColumnVisibility={pickupUserColumnVisibility}
            onSortingChange={setSorting}
            onFiltersChange={handleFiltersChange}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage ?? false}
            fetchNextPage={fetchNextPage}
            height={450}
          />
        </div>
      )}
    </ActionDialog>
  );
};

export default UserPickup;
