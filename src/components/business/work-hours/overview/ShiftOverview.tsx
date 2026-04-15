import DataTable from "@/components/data-table/DataTable";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  initialFilters,
  initialSorting,
} from "@/components/data-table/hooks/useTableViews";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Toolbar } from "@/components/toolbar/Toolbar";
import type { Shift } from "@/types/Shift";
import type { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { AddShiftDialog } from "../form/AddShiftDialog";
import { UpdateShiftDialog } from "../form/UpdateShiftDialog";
import { createShiftColumns, shiftColumnVisibility } from "./ShiftColumns";
import { QUERY_KEY, useShifts } from "./useShifts";

export const SHIFTS_OVERVIEW_KEY = "shifts-overview";

const ShiftOverview = () => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortRule[]>(() =>
    initialSorting(SHIFTS_OVERVIEW_KEY),
  );
  const [filters, setFilters] = useState<FilterRule[]>(() =>
    initialFilters(SHIFTS_OVERVIEW_KEY),
  );
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [deletingShift, setDeletingShift] = useState<Shift | null>(null);

  const { data, isLoading, isError } = useShifts(sorting, filters);

  const shifts = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleOpen = useCallback((rows: Row<Shift>[]) => {
    const first = rows[0];
    if (first) setEditingShift(first.original);
  }, []);

  const handleDelete = useCallback((rows: Row<Shift>[]) => {
    const first = rows[0];
    if (first) setDeletingShift(first.original);
  }, []);

  const columns = useMemo(
    () => createShiftColumns(handleOpen, handleDelete),
    [handleOpen, handleDelete],
  );

  const selectedRows = useMemo(
    () => shifts.filter((row) => rowSelection[row.id]),
    [shifts, rowSelection],
  );

  const handleFiltersChange = useCallback((filters: FilterRule[]) => {
    setFilters(filters);
    setRowSelection({});
  }, []);

  if (isError) return <div>Error loading shifts</div>;

  return (
    <div className="my-2 flex flex-1 min-h-0 w-full flex-col">
      <Toolbar
        selectedRows={selectedRows}
        selectedCount={Object.keys(rowSelection).length}
        onAdd={() => setAddOpen(true)}
        onDelete={(rows) =>
          handleDelete(rows.map((r) => ({ original: r }) as Row<Shift>))
        }
        setRowSelection={setRowSelection}
      />

      <DataTable
        isLoading={isLoading}
        defaultViewName="Shifts"
        tableId={SHIFTS_OVERVIEW_KEY}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        getRowId={(row) => row.id}
        totalCount={total}
        columns={columns}
        data={shifts}
        initialColumnVisibility={shiftColumnVisibility}
        onSortingChange={setSorting}
        onFiltersChange={handleFiltersChange}
        isFetchingNextPage={false}
        hasNextPage={false}
        fetchNextPage={() => {}}
      />

      <AddShiftDialog open={isAddOpen} setOpen={setAddOpen} />

      {editingShift && (
        <UpdateShiftDialog
          shift={editingShift}
          open={!!editingShift}
          setOpen={(o) => !o && setEditingShift(null)}
        />
      )}

      {deletingShift && (
        <DeleteDialog
          open={!!deletingShift}
          setOpen={(o) => !o && setDeletingShift(null)}
          id={deletingShift.id}
          title="Delete Shift"
          target="shift"
          queryKeys={[QUERY_KEY]}
          confirmationMessage={
            <>
              You're about to delete shift{" "}
              <span className="font-semibold">
                {deletingShift.day_start_time.slice(0, 5)} -{" "}
                {deletingShift.day_end_time.slice(0, 5)}
              </span>
              .
            </>
          }
        />
      )}
    </div>
  );
};

export default ShiftOverview;
