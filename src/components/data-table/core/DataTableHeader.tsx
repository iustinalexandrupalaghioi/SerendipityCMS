import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type {
  ColumnType,
  FilterRule,
} from "@/components/data-table/features/filtering/filters";
import { flexRender } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useDataTableContext } from "../DataTableContext";
import { DataTableHeaderDropdown } from "./DataTableHeaderDropdown";
import { FilterPanel } from "../features/filtering/FilterPanel";
import type { Enum } from "@/types/EnumType";

// No props — everything comes from context.
// The only reason to pass props here in the future would be
// to override context values for a one-off embedded usage.

export function DataTableHeader<TData>() {
  const { table, lastLeafColumnId, views, preFilters } =
    useDataTableContext<TData>();
  const { sorting, filters, setSorting, setFilters } = views;

  const lockedColumnIds = new Set(preFilters.map((p) => p.columnId));

  // ── Filter drawer — local UI state, not shared ──
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterDrawerColumnId, setFilterDrawerColumnId] = useState<
    string | null
  >(null);
  const [filterDrawerColumnName, setFilterDrawerColumnName] = useState<
    string | null
  >(null);
  const [filterDrawerColumnType, setFilterDrawerColumnType] =
    useState<ColumnType | null>(null);
  const [filterDrawerColumnOrigin, setFilterDrawerColumnOrigin] = useState<
    string | undefined
  >("");
  const [filterDrawerSelectOptions, setFilterDrawerSelectOptions] = useState<
    Enum[]
  >([]);

  // ── Handlers ──

  const handleOpenFilterDrawer = (
    columnId: string,
    columnType: ColumnType | null,
    selectOptions?: Enum[],
    columnName?: string | null,
    origin?: string,
  ) => {
    setFilterDrawerColumnId(columnId);
    setFilterDrawerColumnType(columnType);
    setFilterDrawerColumnName(columnName ?? columnId);
    setFilterDrawerSelectOptions(selectOptions ?? []);
    setFilterDrawerColumnOrigin(origin);
    setFilterDrawerOpen(true);
  };

  // ── Listen for open-filter events dispatched by FilterChips ──
  // FilterChips and DataTableHeader are siblings — neither owns the other.
  // The custom event lets FilterChips trigger the drawer without shared state.
  useEffect(() => {
    const handler = (e: Event) => {
      const { columnId } = (e as CustomEvent<{ columnId: string }>).detail;
      const column = table.getColumn(columnId);
      if (!column) return;

      const meta = column.columnDef.meta;
      handleOpenFilterDrawer(
        columnId,
        meta?.columnType ?? null,
        meta?.selectOptions,
        meta?.columnName ?? columnId,
        meta?.origin,
      );
    };

    window.addEventListener("datatable:open-filter", handler);
    return () => window.removeEventListener("datatable:open-filter", handler);
  }, [table]);

  // ── Listen for apply-filter events dispatched by CellContextMenu ──
  useEffect(() => {
    const handler = (e: Event) => {
      const { rule } = (e as CustomEvent<{ rule: FilterRule }>).detail;
      handleApplyFilter(rule);
    };

    window.addEventListener("datatable:apply-filter", handler);
    return () => window.removeEventListener("datatable:apply-filter", handler);
  }, []);

  const handleResizeStart = (
    e: React.MouseEvent | React.TouchEvent,
    header: any,
  ) => {
    document.body.style.cursor = "col-resize";
    const onMouseUp = () => {
      document.body.style.cursor = "";
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onMouseUp);
    };
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onMouseUp);
    header.getResizeHandler()(e);
  };

  const handleResizeDoubleClick = () => {
    table.resetColumnSizing();
  };

  const handlePrimarySort = (columnId: string, desc: boolean) => {
    const origin = table.getColumn(columnId)?.columnDef.meta?.origin;
    setSorting([{ id: columnId, desc, origin }]);
  };

  const handleAlsoSort = (columnId: string, desc: boolean) => {
    const origin = table.getColumn(columnId)?.columnDef.meta?.origin;
    const existing = sorting.filter((s) => s.id !== columnId);
    setSorting([...existing, { id: columnId, desc, origin }]);
  };

  const handleClearSort = (columnId: string) => {
    setSorting(sorting.filter((s) => s.id !== columnId));
  };

  const handleApplyFilter = (rule: FilterRule) => {
    setFilters((prev) => {
      const exists = prev.find((f) => f.columnId === rule.columnId);
      return exists
        ? prev.map((f) => (f.columnId === rule.columnId ? rule : f))
        : [...prev, rule];
    });
    setFilterDrawerOpen(false);
  };

  return (
    <TableHeader className=" top-0 z-10 bg-background">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const isLast = header.column.id === lastLeafColumnId;
            const canSort = header.column.getCanSort();
            const canFilter = header.column.getCanFilter();
            const columnName =
              header.column.columnDef.meta?.columnName ?? header.column.id;
            const columnId = header.column.id;
            const columnType = header.column.columnDef.meta?.columnType ?? null;
            const columnOrigin = header.column.columnDef.meta?.origin;
            const selectOptions =
              header.column.columnDef.meta?.selectOptions ?? [];
            const sortIndex = sorting.findIndex(
              (s) => s.id === header.column.id,
            );
            const sortRule = sortIndex !== -1 ? sorting[sortIndex] : null;
            const isPinned = header.column.getIsPinned();
            const isMultiSort = sorting.length > 1;

            return (
              <TableHead
                key={header.id}
                style={{
                  top: 0,
                  position: "sticky", // ← always sticky
                  width: isLast
                    ? undefined
                    : `calc(var(--header-${header.id}-size) * 1px)`,
                  minWidth: isLast
                    ? undefined
                    : `calc(var(--header-${header.id}-size) * 1px)`,
                  maxWidth: isLast
                    ? undefined
                    : `calc(var(--header-${header.id}-size) * 1px)`,
                  left: isPinned ? header.column.getStart("left") : undefined,
                  zIndex: isPinned ? 30 : 20,
                }}
                className={cn(
                  "relative h-0 max-w-fit border-b px-3 text-xs font-medium",
                  "overflow-hidden bg-background whitespace-nowrap select-none",
                  !isLast && "border-r",
                  header.column.columnDef.meta?.className,
                )}
              >
                <div className="flex items-center gap-2">
                  {typeof header.column.columnDef.header === "function" ? (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  ) : (
                    <DataTableHeaderDropdown
                      columnType={columnType}
                      columnId={header.column.id}
                      selectOptions={selectOptions}
                      canSort={canSort}
                      sorting={sorting}
                      sortRule={sortRule}
                      sortIndex={sortIndex}
                      isMultiSort={isMultiSort}
                      onPrimarySort={handlePrimarySort}
                      onAlsoSort={handleAlsoSort}
                      onClearSort={handleClearSort}
                      columnName={columnName}
                      handleOpenFilterDrawer={handleOpenFilterDrawer}
                      locked={lockedColumnIds.has(columnId)}
                      canFilter={canFilter}
                      origin={columnOrigin}
                    />
                  )}
                </div>

                {header.column.getCanResize() && (
                  <div
                    onMouseDown={(e) => handleResizeStart(e, header)}
                    onTouchStart={(e) => handleResizeStart(e, header)}
                    onDoubleClick={handleResizeDoubleClick}
                    className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent"
                  />
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}

      {/* Filter drawer — rendered inside TableHeader so it stays
          in the same React subtree, avoiding portal z-index issues */}
      <FilterPanel
        columnType={filterDrawerColumnType}
        columnName={filterDrawerColumnName}
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        columnId={filterDrawerColumnId}
        selectOptions={filterDrawerSelectOptions}
        initialValue={
          filters.find((f) => f.columnId === filterDrawerColumnId) ?? null
        }
        onApply={handleApplyFilter}
        origin={filterDrawerColumnOrigin}
      />
    </TableHeader>
  );
}
