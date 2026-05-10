import type { Cell, Row } from "@tanstack/react-table";
import type { ColumnType } from "@/components/data-table/features/filtering/filters";
import type { ReactNode, RefObject } from "react";
import type { Enum } from "@/types/EnumType";

// ─────────────────────────────────────────────
// Public action type (used in column meta)
// ─────────────────────────────────────────────

export interface RowAction<TData> {
  label: ReactNode;
  isEligible?: (row: Row<TData>) => boolean;
  onSelect: (eligibleRows: Row<TData>[]) => void;
  destructive?: boolean;
}

// ─────────────────────────────────────────────
// Internal resolved action (ready to render)
// ─────────────────────────────────────────────

export interface ResolvedAction {
  label: ReactNode;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

// ─────────────────────────────────────────────
// Context menu state
// ─────────────────────────────────────────────

export interface ContextMenuState<TData> {
  x: number;
  y: number;
  copyValue: unknown;
  copyUrl: string | null;
  effectiveRows: Row<TData>[];
  isMulti: boolean;
  onOpen?: (rows: Row<TData>[]) => void;
  deleteAction: ResolvedAction | null;
  actions: ResolvedAction[];
  // Column info — used to build filter rules from the context menu
  columnId: string;
  columnType: ColumnType | null;
  columnName: string;
  selectOptions?: Enum[];
  origin?: string;
}

// ─────────────────────────────────────────────
// Component prop types
// ─────────────────────────────────────────────

export interface VirtualTableBodyProps<TData> {
  rows: Row<TData>[];
  lastColumnId: string | undefined;
  columnsLength: number;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isResizing: boolean;
  onCellContextMenu: (
    e: React.MouseEvent,
    cell: Cell<TData, unknown>,
    effectiveRows: Row<TData>[],
  ) => void;
  rowSelection: Record<string, boolean>;
  onRowClick?: (e: React.MouseEvent, row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
  selectedCellValuesRef: RefObject<() => string>;
  onRowContextClick: (row: Row<TData>) => void;
  isLoading: boolean;
  isCellSelected: (rowId: string, columnId: string) => boolean;
  onCellClick: (e: React.MouseEvent, cell: Cell<TData, unknown>) => void;
}
