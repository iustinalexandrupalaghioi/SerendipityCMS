import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import type { VirtualTableBodyProps } from "./types";

// ─────────────────────────────────────────────
// SkeletonRows
//
// Renders N rows of animated placeholder cells
// matching the actual column structure.
// Widths mirror the real colgroup so columns
// don't shift when data loads in.
// ─────────────────────────────────────────────

const SKELETON_ROW_COUNT = 12;

function SkeletonRows({
  columnsLength,
  lastColumnId,
}: {
  columnsLength: number;
  lastColumnId: string | undefined;
}) {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="odd:bg-muted/60">
          {Array.from({ length: columnsLength }).map((_, colIndex) => {
            const isLast = colIndex === columnsLength - 1;
            const colId = isLast ? lastColumnId : `col-${colIndex}`;

            return (
              <TableCell
                key={colIndex}
                style={{
                  width: isLast
                    ? undefined
                    : `calc(var(--col-${colId}-size) * 1px)`,
                  minWidth: isLast
                    ? undefined
                    : `calc(var(--col-${colId}-size) * 1px)`,
                  maxWidth: isLast
                    ? undefined
                    : `calc(var(--col-${colId}-size) * 1px)`,
                }}
                className="relative h-0 border-r border-b px-3"
              >
                <div
                  className={cn(
                    "h-4 animate-pulse rounded-full bg-muted-foreground/15",
                    // Vary widths so it looks natural rather than uniform
                    rowIndex % 3 === 0 && colIndex % 2 === 0 && "w-3/4",
                    rowIndex % 3 === 1 && colIndex % 2 === 0 && "w-1/2",
                    rowIndex % 3 === 2 && colIndex % 2 === 0 && "w-2/3",
                    colIndex % 2 !== 0 && "w-4/5",
                    // First column (usually a checkbox/icon) stays narrow
                    colIndex === 0 && "-ms-2 w-3",
                    // First column (usually a checkbox/icon) stays narrow
                    colIndex === 1 && "w-3",
                  )}
                />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────
// VirtualTableBody
// ─────────────────────────────────────────────

function VirtualTableBodyInner<TData>({
  rows,
  lastColumnId,
  columnsLength,
  scrollContainerRef,
  isResizing,
  onCellContextMenu,
  onRowClick,
  onRowDoubleClick,
  rowSelection,
  selectedCellValuesRef,
  onRowContextClick,
  isLoading,
}: VirtualTableBodyProps<TData>) {
  const selectedCellElRef = useRef<HTMLTableCellElement | null>(null);
  const selectedCellIndexRef = useRef<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 18,
    overscan: isResizing ? 0 : 30,
  });

  useLayoutEffect(() => {
    if (rows.length > 0) {
      virtualizer.measure();
    }
  }, [rows.length]);

  const handleCellClick = useCallback(
    (
      e: React.MouseEvent,
      rowIndex: number,
      cellEl: HTMLTableCellElement,
      isContextMenu = false,
    ) => {
      const colIndex = Array.from(cellEl.parentElement?.children ?? []).indexOf(
        cellEl,
      );

      const clearAll = () => {
        document.querySelectorAll("[data-sel]").forEach((el) => el.remove());
      };

      if (e.shiftKey && selectedCellIndexRef.current !== null) {
        e.stopPropagation();
        clearAll();

        const fromRow = Math.min(
          selectedCellIndexRef.current.rowIndex,
          rowIndex,
        );
        const toRow = Math.max(selectedCellIndexRef.current.rowIndex, rowIndex);
        const fromCol = Math.min(
          selectedCellIndexRef.current.colIndex,
          colIndex,
        );
        const toCol = Math.max(selectedCellIndexRef.current.colIndex, colIndex);

        const tbody = cellEl.closest("tbody");
        if (!tbody) return;

        const selectedValues: string[][] = [];

        for (let r = fromRow; r <= toRow; r++) {
          const tr = tbody.children[r] as HTMLTableRowElement;
          if (!tr) continue;
          const rowValues: string[] = [];

          for (let c = fromCol; c <= toCol; c++) {
            const td = tr.children[c] as HTMLTableCellElement;
            if (!td) continue;
            rowValues.push(td.title ?? "");
          }

          selectedValues.push(rowValues);
        }

        const tsv = selectedValues.map((row) => row.join("\t")).join("\n");
        navigator.clipboard.writeText(tsv);
        selectedCellValuesRef.current = () => tsv;
        return;
      }

      if (isContextMenu && selectedCellElRef.current === cellEl) return;

      clearAll();

      if (!isContextMenu && selectedCellElRef.current === cellEl) {
        selectedCellElRef.current = null;
        selectedCellIndexRef.current = null;
        selectedCellValuesRef.current = () => "";
        return;
      }

      selectedCellElRef.current = cellEl;
      selectedCellIndexRef.current = { rowIndex, colIndex };
      selectedCellValuesRef.current = () => cellEl.title ?? "";

      if (colIndex >= 2) {
        const marker = document.createElement("span");
        marker.dataset.sel = "";
        marker.className =
          "pointer-events-none absolute inset-0 z-10 border border-primary";
        cellEl.appendChild(marker);
      }
    },
    [],
  );

  const virtualRows = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalHeight - virtualRows[virtualRows.length - 1].end
      : 0;

  if (isLoading) {
    return (
      <TableBody>
        <SkeletonRows
          columnsLength={columnsLength}
          lastColumnId={lastColumnId}
        />
      </TableBody>
    );
  }

  if (!rows.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columnsLength} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {paddingTop > 0 && (
        <TableRow>
          <TableCell
            colSpan={columnsLength}
            style={{ height: paddingTop, padding: 0, border: 0 }}
          />
        </TableRow>
      )}

      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index];

        return (
          <TableRow
            key={row.id}
            data-index={virtualRow.index}
            ref={(node) => {
              if (!isResizing && node) virtualizer.measureElement(node);
            }}
            className="select-none odd:bg-muted/60"
            data-state={row.getIsSelected() ? "selected" : undefined}
            onClick={(e) => onRowClick?.(e, row)}
            onDoubleClick={() => onRowDoubleClick?.(row)}
          >
            {row.getVisibleCells().map((cell) => {
              const isLast = cell.column.id === lastColumnId;
              const isPinned = cell.column.getIsPinned();

              return (
                <TableCell
                  key={cell.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCellClick(e, virtualRow.index, e.currentTarget, true);
                    onRowClick?.(e, row);
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 2) e.stopPropagation();
                  }}
                  onContextMenu={(e) => {
                    const sel = rowSelection;
                    const isInMultiSelection =
                      Object.keys(sel).length > 1 && sel[row.id];
                    const isAlreadySingleSelected =
                      Object.keys(sel).length === 1 && sel[row.id];

                    const effectiveRows =
                      isInMultiSelection || isAlreadySingleSelected
                        ? rows.filter((r) => sel[r.id])
                        : [row];

                    if (!isInMultiSelection && !isAlreadySingleSelected) {
                      handleCellClick(
                        e,
                        virtualRow.index,
                        e.currentTarget,
                        true,
                      );
                    }

                    onRowContextClick(row);
                    onCellContextMenu(e, cell, effectiveRows);
                  }}
                  title={String(cell.getValue() ?? "")}
                  style={{
                    width: isLast
                      ? undefined
                      : `calc(var(--col-${cell.column.id}-size) * 1px)`,
                    minWidth: isLast
                      ? undefined
                      : `calc(var(--col-${cell.column.id}-size) * 1px)`,
                    maxWidth: isLast
                      ? undefined
                      : `calc(var(--col-${cell.column.id}-size) * 1px)`,
                    position: isPinned ? "sticky" : undefined,
                    left: isPinned ? cell.column.getStart("left") : undefined,
                    zIndex: isPinned ? 20 : 0,
                  }}
                  className={cn(
                    "relative h-0 px-3 text-xs",
                    "truncate overflow-hidden border-b whitespace-nowrap",
                    !isLast && "border-r",
                    isPinned && "bg-background",
                    cell.column.columnDef.meta?.className,
                  )}
                >
                  <div className="min-w-0 truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}

      {paddingBottom > 0 && (
        <TableRow>
          <TableCell
            colSpan={columnsLength}
            style={{ height: paddingBottom, padding: 0, border: 0 }}
          />
        </TableRow>
      )}
    </TableBody>
  );
}

export const VirtualTableBody = memo(VirtualTableBodyInner) as <TData>(
  props: VirtualTableBodyProps<TData>,
) => ReactNode;
