import type { Row } from "@tanstack/react-table";
import { useEffect, useRef } from "react";
import { useDataTableContext } from "../DataTableContext";
import { useCellSelection } from "../hooks/useCellSelection";
import { useContextMenu } from "../hooks/useContextMenu";
import { useRowSelection } from "../hooks/useRowSelection";
import { CellContextMenu } from "./CellContextMenu";
import { VirtualTableBody } from "./VirtualTableBody";
import type { RowAction } from "./types";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string;
    onOpen?: (rows: Row<TData>[]) => void;
    getRowUrl?: (row: Row<TData>) => string;
    onDelete?: (rows: Row<TData>[]) => void;
    isDeleteEligible?: (row: Row<TData>) => boolean;
    actions?: () => RowAction<TData>[];
  }
}

export function DataTableBody<TData>() {
  const { table, scrollContainerRef, isResizing, rowSelection, isLoading } =
    useDataTableContext<TData>();

  const { contextMenu, handleCellContextMenu, closeContextMenu } =
    useContextMenu(table);

  const { isCellSelected, handleCellClick, clearSelection, getSelectionTsv } =
    useCellSelection(table);

  const { handleRowClick, handleRowDoubleClick, handleRowContextClick } =
    useRowSelection(table);

  // Stable ref so CellContextMenu always reads the latest TSV without re-rendering
  const selectedCellValuesRef = useRef<() => string>(getSelectionTsv);
  useEffect(() => {
    selectedCellValuesRef.current = getSelectionTsv;
  }, [getSelectionTsv]);

  // Escape clears cell selection; clicking the bare scroll container does too
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.target === scrollContainerRef.current) clearSelection();
    };

    window.addEventListener("keydown", onKeyDown);
    scrollContainerRef.current?.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      scrollContainerRef.current?.removeEventListener(
        "pointerdown",
        onPointerDown,
      );
    };
  }, [clearSelection, scrollContainerRef]);

  return (
    <>
      <VirtualTableBody
        isLoading={isLoading}
        selectedCellValuesRef={selectedCellValuesRef}
        rowSelection={rowSelection}
        rows={table.getRowModel().rows}
        lastColumnId={table.getAllLeafColumns().at(-1)?.id}
        columnsLength={table.getVisibleLeafColumns().length}
        scrollContainerRef={scrollContainerRef}
        isResizing={isResizing}
        onCellContextMenu={handleCellContextMenu}
        onRowContextClick={handleRowContextClick}
        onRowClick={handleRowClick}
        onRowDoubleClick={handleRowDoubleClick}
        isCellSelected={isCellSelected}
        onCellClick={handleCellClick}
      />
      <CellContextMenu
        selectedCellValuesRef={selectedCellValuesRef}
        state={contextMenu}
        onClose={closeContextMenu}
        allSelectedIds={Object.keys(table.getState().rowSelection)}
      />
    </>
  );
}
