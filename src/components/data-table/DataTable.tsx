import type {
  ColumnType,
  FilterRule,
} from "@/components/data-table/features/filtering/filters";
import { useTableViews } from "@/components/data-table/hooks/useTableViews";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { DataTableContent } from "./DataTableContent";
import { DataTableContext } from "./DataTableContext";
import { FilterChips } from "./features/filtering/FilterChips";
import { TableViewsBar } from "./features/views/DataTableViewBar";
import { useAvailableHeight } from "./hooks/useAvailableHeight";
import { useScrollFreeze } from "./hooks/useScrollFreeze";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    className?: string;
    columnName?: string;
    origin?: string;
    columnType?: ColumnType | null;
    selectOptions?: string[];
  }
  interface ColumnSort {
    origin?: string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  isLoading: boolean;
  rowSelection: Record<string, boolean>;
  setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>;
  getRowId?: (row: TData) => string;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  height?: number;
  initialColumnVisibility?: VisibilityState;
  tableId: string;
  defaultViewName?: string;
  onSortingChange?: (sorting: SortingState) => void;
  quickSearchEnabled?: boolean;
  onFiltersChange?: (filters: FilterRule[]) => void;
  slotId?: string;
  preFilters?: FilterRule[];
}

function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  totalCount,
  rowSelection,
  setRowSelection,
  getRowId,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  height: fixedHeight,
  initialColumnVisibility,
  tableId,
  defaultViewName,
  onSortingChange,
  quickSearchEnabled = true,
  onFiltersChange,
  slotId,
  preFilters,
}: DataTableProps<TData, TValue>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  // ── Views (sorting, filters, column visibility/sizing, named views) ──
  const views = useTableViews(
    tableId,
    initialColumnVisibility,
    defaultViewName,
    preFilters,
  );
  const { columnVisibility, columnSizing } = views;

  // ── Notify parent of sorting/filter changes ──
  const prevSortingRef = useRef<string>(JSON.stringify(views.sorting));
  useEffect(() => {
    const key = JSON.stringify(views.sorting);
    if (key === prevSortingRef.current) return;
    prevSortingRef.current = key;
    onSortingChange?.(views.sorting);
  }, [views.sorting]);

  const prevFiltersRef = useRef<string>(JSON.stringify(views.filters));
  useEffect(() => {
    const key = JSON.stringify(views.filters);
    if (key === prevFiltersRef.current) return;
    prevFiltersRef.current = key;
    onFiltersChange?.(views.filters);
  }, [views.filters]);

  // ── TanStack table instance ──
  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    defaultColumn: { enableResizing: true },
    manualPagination: true,
    getRowId: getRowId ?? ((_, index) => String(index)),
    state: {
      columnPinning: {
        left: ["select", "columns"],
      },
      rowSelection,
      columnVisibility,
      columnSizing,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    onRowSelectionChange: setRowSelection,
    onColumnSizingChange: views.setColumnSizing,
    onColumnVisibilityChange: views.setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // ── Column sizing CSS vars (RAF-debounced) ──
  const rafRef = useRef<number | null>(null);
  const [columnSizeVars, setColumnSizeVars] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const colSizes: Record<string, number> = {};
      for (const header of table.getFlatHeaders()) {
        colSizes[`--header-${header.id}-size`] = header.getSize();
        colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
      }
      setColumnSizeVars(colSizes);
    });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  // ── Leaf columns / last column ──
  const leafColumns = table.getVisibleLeafColumns();
  const lastLeafColumnId = leafColumns.at(-1)?.id;

  // ── Height + scroll ──
  const autoHeight = useAvailableHeight(
    fixedHeight !== undefined ? { current: null } : scrollContainerRef,
  );
  const height = fixedHeight ?? autoHeight;
  const isResizing = !!table.getState().columnSizingInfo.isResizingColumn;
  const handleScroll = useScrollFreeze(scrollContainerRef, isResizing);

  return (
    <DataTableContext.Provider
      value={{
        table,
        columnSizeVars,
        leafColumns,
        lastLeafColumnId,
        scrollContainerRef,
        handleScroll,
        height,
        isResizing,
        views,
        isLoading,
        rowSelection,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        totalCount,
        quickSearchEnabled,
        globalFilter,
        setGlobalFilter,
        preFilters: preFilters ?? [],
      }}
    >
      <div id={tableId} className="w-full overflow-hidden">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1 md:flex-row md:items-center md:gap-2">
            <div className="flex items-center gap-2">
              <TableViewsBar />
              <div id={slotId} />
            </div>

            <FilterChips />
          </div>
          <div className="flex shrink-0 items-center justify-end bg-background px-2 py-1 text-sm text-primary">
            {Object.keys(rowSelection).length} / {totalCount}
          </div>
        </div>
        <DataTableContent />
      </div>
    </DataTableContext.Provider>
  );
}

export default DataTable;
