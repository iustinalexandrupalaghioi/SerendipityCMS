import type { Row, Table } from "@tanstack/react-table"
import { useCallback, useRef } from "react"

/**
 * useRowSelection
 *
 * Provides a stable `handleRowClick` that implements:
 *   - Click          → exclusive select (clear others, select clicked)
 *   - Ctrl/Cmd+Click → toggle clicked row, keep rest
 *   - Shift+Click    → range select from last clicked to current
 *   - Double-click   → call onOpen from any column's meta (rows skip this path)
 *
 * The handler is stable across renders (useCallback + tableRef pattern)
 * so it won't break VirtualTableBody's memo.
 */
export function useRowSelection<TData>(table: Table<TData>) {
  const tableRef = useRef(table)
  tableRef.current = table

  // Track the last single-clicked row index for shift-range anchor
  const lastClickedIndexRef = useRef<number | null>(null)

  const handleRowClick = useCallback((e: React.MouseEvent, row: Row<TData>) => {
    const t = tableRef.current
    const allRows = t.getRowModel().rows
    const clickedIndex = allRows.findIndex((r) => r.id === row.id)

    // Checkbox clicks should just toggle without affecting others
    if ((e.target as HTMLElement).closest("[data-checkbox]")) {
      lastClickedIndexRef.current = clickedIndex
      row.toggleSelected()
      return
    }

    if (e.shiftKey && lastClickedIndexRef.current !== null) {
      // ── Shift+Click: range select ──────────────────────────────────
      const from = Math.min(lastClickedIndexRef.current, clickedIndex)
      const to = Math.max(lastClickedIndexRef.current, clickedIndex)

      const next: Record<string, boolean> = {}
      for (let i = from; i <= to; i++) {
        next[allRows[i].id] = true
      }

      t.setRowSelection(next)
    } else if (e.ctrlKey || e.metaKey) {
      // ── Ctrl/Cmd+Click: toggle without clearing others ─────────────
      lastClickedIndexRef.current = clickedIndex
      row.toggleSelected()
    } else {
      // ── Plain click: exclusive select ──────────────────────────────
      lastClickedIndexRef.current = clickedIndex
      const isAlreadyOnlySelected =
        row.getIsSelected() &&
        Object.keys(t.getState().rowSelection).length === 1

      if (isAlreadyOnlySelected) {
        t.setRowSelection({})
      } else {
        t.setRowSelection({ [row.id]: true })
      }
    }
  }, [])

  const handleRowContextClick = useCallback(
    (row: Row<TData>) => {
      const sel = table.getState().rowSelection
      const isInMultiSelection = Object.keys(sel).length > 1 && sel[row.id]
      const isAlreadySingleSelected =
        Object.keys(sel).length === 1 && sel[row.id]

      if (!isInMultiSelection && !isAlreadySingleSelected) {
        table.resetRowSelection()
        row.toggleSelected(true)
      }
    },
    [table]
  )

  const handleRowDoubleClick = useCallback((row: Row<TData>) => {
    const t = tableRef.current
    // Find the first column that has onOpen defined
    const col = t
      .getAllLeafColumns()
      .find((c) => c.columnDef.meta?.onOpen != null)

    if (!col) return

    const selectedRows = t.getSelectedRowModel().rows
    // If the double-clicked row is part of a multi-selection, open all selected;
    // otherwise open just this row.
    const targets =
      selectedRows.length > 1 && selectedRows.some((r) => r.id === row.id)
        ? selectedRows
        : [row]

    col.columnDef.meta!.onOpen!(targets)
  }, [])

  return { handleRowClick, handleRowDoubleClick, handleRowContextClick }
}
