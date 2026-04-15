import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import { Toolbar } from "@/components/toolbar/Toolbar";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import type { FreeDay } from "@/types/FreeDay";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import {
  createFreeDayColumns,
  freeDayColumnVisibility,
} from "./FreeDayColumns";
import { useFreeDays, QUERY_KEY } from "./useFreeDays";
import { AddFreeDayDialog } from "../form/AddFreeDayDialog";
import { UpdateFreeDayDialog } from "../form/UpdateFreeDaydialog";

export const FREE_DAYS_OVERVIEW_KEY = "free-days-overview";

const FreeDayOverview = () => {
  // ── Table state ──
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(FREE_DAYS_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(FREE_DAYS_OVERVIEW_KEY),
  );

  // ── Dialog state ──
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingFreeDay, setEditingFreeDay] = useState<FreeDay | null>(null);
  const [deletingFreeDay, setDeletingFreeDay] = useState<FreeDay | null>(null);

  // ── Data ──
  const { data, isLoading, isError } = useFreeDays(sorting, filters);
  const freeDays = data?.items ?? [];
  const total = data?.total ?? 0;

  // ── Open (edit) ──
  const handleOpen = useCallback((rows: Row<FreeDay>[]) => {
    const first = rows[0];
    if (first) setEditingFreeDay(first.original);
  }, []);

  // ── Delete ──
  const handleDeleteOpen = useCallback((rows: Row<FreeDay>[]) => {
    if (rows.length !== 1) return;
    setDeletingFreeDay(rows[0].original);
  }, []);

  // ── Columns ──
  const columns = useMemo(
    () => createFreeDayColumns(handleOpen, handleDeleteOpen),
    [handleOpen, handleDeleteOpen],
  );

  // ── Selection ──
  const selectedRows = useMemo(
    () => freeDays.filter((row) => rowSelection[row.id]),
    [freeDays, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading free days</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        onAdd={() => setAddOpen(true)}
        onDelete={(rows) =>
          handleDeleteOpen(rows.map((r) => ({ original: r }) as Row<FreeDay>))
        }
        setRowSelection={setRowSelection}
      />

      <DataTable
        isLoading={isLoading}
        defaultViewName="Free days"
        tableId={FREE_DAYS_OVERVIEW_KEY}
        isFetchingNextPage={false}
        hasNextPage={false}
        fetchNextPage={() => {}}
        getRowId={(row) => row.id}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        totalCount={total}
        columns={columns}
        initialColumnVisibility={freeDayColumnVisibility}
        data={freeDays}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
      />

      {/* dialogs */}
      <AddFreeDayDialog open={isAddOpen} setOpen={setAddOpen} />

      {editingFreeDay && (
        <UpdateFreeDayDialog
          open={!!editingFreeDay}
          setOpen={(open) => !open && setEditingFreeDay(null)}
          freeDay={editingFreeDay}
        />
      )}

      {deletingFreeDay && (
        <DeleteDialog
          open={!!deletingFreeDay}
          setOpen={(open) => !open && setDeletingFreeDay(null)}
          id={deletingFreeDay.id}
          title="Delete Free Day"
          target="free_day"
          queryKeys={[QUERY_KEY]}
          confirmationMessage={
            <>
              You're about to delete free day from{" "}
              <span className="font-semibold">
                "{deletingFreeDay.date_from}"
              </span>{" "}
              until{" "}
              <span className="font-semibold">
                "{deletingFreeDay.date_until}"
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

export default FreeDayOverview;
