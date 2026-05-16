import DataTable from "@/components/data-table/DataTable";
import { Toolbar } from "@/components/toolbar/Toolbar";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import type { Profile } from "@/types/User";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { createUserColumns, userColumnVisibility } from "./UserColumns";
import { UpdateUserProfileDialog } from "../form/UpdateUserProfileDialog";
import { useUserProfiles } from "./useUserProfiles";

export const USERS_OVERVIEW_KEY = "users-overview";

const UserOverview = () => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(USERS_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(USERS_OVERVIEW_KEY),
  );

  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  const {
    allItems: users,
    total,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useUserProfiles(sorting, filters);

  const handleOpen = useCallback((rows: Row<Profile>[]) => {
    const first = rows[0];
    if (first) setEditingUser(first.original);
  }, []);

  const columns = useMemo(() => createUserColumns(handleOpen), [handleOpen]);

  const selectedRows = useMemo(
    () => users.filter((row) => rowSelection[row.id]),
    [users, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading users</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        setRowSelection={setRowSelection}
      />

      <DataTable
        isLoading={isLoading}
        defaultViewName="Users"
        tableId={USERS_OVERVIEW_KEY}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        fetchNextPage={fetchNextPage}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        totalCount={total}
        columns={columns}
        initialColumnVisibility={userColumnVisibility}
        data={users}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
      />

      {editingUser && (
        <UpdateUserProfileDialog
          open={!!editingUser}
          setOpen={(open) => !open && setEditingUser(null)}
          userProfile={editingUser}
        />
      )}
    </div>
  );
};

export default UserOverview;
