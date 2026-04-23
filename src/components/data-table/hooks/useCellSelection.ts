import type { Cell, Table } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";

export type CellAddress = { rowId: string; columnId: string };

const EXCLUDED_COLUMNS = ["select", "columns"];

const cellKey = (rowId: string, columnId: string) => `${rowId}::${columnId}`;

function cellValue<TData>(cell: Cell<TData, unknown>): string {
  const v = cell.getValue();
  const type = cell.column.columnDef.meta?.columnType;

  if (v == null) return "";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (type === "date" && typeof v === "string") {
    try {
      return format(new Date(v), "dd-MM-yyyy");
    } catch {
      /**/
    }
  }
  return String(v);
}

export function useCellSelection<TData>(table: Table<TData>) {
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const anchorRef = useRef<CellAddress | null>(null);
  const tableRef = useRef(table);
  tableRef.current = table;

  const getSelectionTsv = useCallback((): string => {
    if (selection.size === 0) return "";

    const t = tableRef.current;
    const rows = t.getRowModel().rows;
    const cols = t
      .getVisibleLeafColumns()
      .filter((c) => !EXCLUDED_COLUMNS.includes(c.id));

    const rowIds = rows.map((r) => r.id);
    const colIds = cols.map((c) => c.id);

    const selectedRowIds = rowIds.filter((rId) =>
      colIds.some((cId) => selection.has(cellKey(rId, cId))),
    );
    const selectedColIds = colIds.filter((cId) =>
      rowIds.some((rId) => selection.has(cellKey(rId, cId))),
    );

    return selectedRowIds
      .map((rId) => {
        const row = rows.find((r) => r.id === rId)!;
        return selectedColIds
          .map((cId) => {
            if (!selection.has(cellKey(rId, cId))) return "";
            const cell = row.getAllCells().find((c) => c.column.id === cId);
            return cell ? cellValue(cell) : "";
          })
          .join("\t");
      })
      .join("\n");
  }, [selection]);

  // ── Ctrl+C ──
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key !== "c") return;
      const tsv = getSelectionTsv();
      if (tsv) navigator.clipboard.writeText(tsv);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [getSelectionTsv]);

  const handleCellClick = useCallback(
    (e: React.MouseEvent, cell: Cell<TData, unknown>) => {
      const key = cellKey(cell.row.id, cell.column.id);

      if (e.shiftKey && anchorRef.current) {
        const rows = tableRef.current.getRowModel().rows;
        const cols = tableRef.current
          .getVisibleLeafColumns()
          .filter((c) => !EXCLUDED_COLUMNS.includes(c.id));

        const anchorRowIdx = rows.findIndex(
          (r) => r.id === anchorRef.current!.rowId,
        );
        const anchorColIdx = cols.findIndex(
          (c) => c.id === anchorRef.current!.columnId,
        );
        const clickRowIdx = rows.findIndex((r) => r.id === cell.row.id);
        const clickColIdx = cols.findIndex((c) => c.id === cell.column.id);

        const r1 = Math.min(anchorRowIdx, clickRowIdx);
        const r2 = Math.max(anchorRowIdx, clickRowIdx);
        const c1 = Math.min(anchorColIdx, clickColIdx);
        const c2 = Math.max(anchorColIdx, clickColIdx);

        const next = new Set<string>();
        for (let r = r1; r <= r2; r++)
          for (let c = c1; c <= c2; c++)
            next.add(cellKey(rows[r].id, cols[c].id));

        setSelection(next);
      } else if (e.ctrlKey || e.metaKey) {
        anchorRef.current = { rowId: cell.row.id, columnId: cell.column.id };
        setSelection((prev) => {
          const next = new Set(prev);
          next.has(key) ? next.delete(key) : next.add(key);
          return next;
        });
      } else {
        anchorRef.current = { rowId: cell.row.id, columnId: cell.column.id };
        setSelection(new Set([key]));
      }
    },
    [],
  );

  const clearSelection = useCallback(() => {
    setSelection(new Set());
    anchorRef.current = null;
  }, []);

  const isCellSelected = useCallback(
    (rowId: string, columnId: string) =>
      selection.has(cellKey(rowId, columnId)),
    [selection],
  );

  return {
    isCellSelected,
    handleCellClick,
    clearSelection,
    selectionSize: selection.size,
    getSelectionTsv,
  };
}
