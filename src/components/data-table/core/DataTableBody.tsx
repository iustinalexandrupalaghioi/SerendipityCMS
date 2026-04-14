import { useContextMenu } from "../hooks/useContextMenu"
import { useRowSelection } from "../hooks/useRowSelection"
import { CellContextMenu } from "./CellContextMenu"
import { VirtualTableBody } from "./VirtualTableBody"
import type { RowAction } from "./types"
import type { Row } from "@tanstack/react-table"
import { useRef } from "react"
import { useDataTableContext } from "../DataTableContext"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string
    onOpen?: (rows: Row<TData>[]) => void
    getRowUrl?: (row: Row<TData>) => string
    onDelete?: (rows: Row<TData>[]) => void
    isDeleteEligible?: (row: Row<TData>) => boolean
    actions?: () => RowAction<TData>[]
  }
}

// No props — everything comes from context.

export function DataTableBody<TData>() {
  const { table, scrollContainerRef, isResizing, rowSelection, isLoading } =
    useDataTableContext<TData>()

  const columnsLength = table.getVisibleLeafColumns().length
  const selectedCellValuesRef = useRef<() => string>(() => "")

  const { contextMenu, handleCellContextMenu, closeContextMenu } =
    useContextMenu(table)
  const { handleRowClick, handleRowDoubleClick, handleRowContextClick } =
    useRowSelection(table)

  return (
    <>
      <VirtualTableBody
        isLoading={isLoading}
        selectedCellValuesRef={selectedCellValuesRef}
        rowSelection={rowSelection}
        rows={table.getRowModel().rows}
        lastColumnId={table.getAllLeafColumns().at(-1)?.id}
        columnsLength={columnsLength}
        scrollContainerRef={scrollContainerRef}
        isResizing={isResizing}
        onCellContextMenu={handleCellContextMenu}
        onRowContextClick={handleRowContextClick}
        onRowClick={handleRowClick}
        onRowDoubleClick={handleRowDoubleClick}
      />
      <CellContextMenu
        selectedCellValuesRef={selectedCellValuesRef}
        state={contextMenu}
        onClose={closeContextMenu}
        allSelectedIds={Object.keys(table.getState().rowSelection)}
      />
    </>
  )
}
