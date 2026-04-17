import { createContext, useContext } from "react";
import type { Column, Table } from "@tanstack/react-table";
import type { RefObject } from "react";
import type { useTableViews } from "./hooks/useTableViews";
import type { FilterRule } from "./features/filtering/filters";

// ─────────────────────────────────────────────
// Context shape
// ─────────────────────────────────────────────

export interface DataTableContextValue<TData> {
  // Core TanStack table instance — sub-components read rows, headers, state from here
  table: Table<TData>;

  // Column sizing — CSS custom properties spread onto the wrapping div
  columnSizeVars: Record<string, number>;
  leafColumns: Column<TData>[];
  lastLeafColumnId: string | undefined;

  // Scroll container — shared ref so Header can be sticky, Body can observe intersection
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  height: number | undefined;

  // Resize — lets Body skip virtualization thrashing during a drag
  isResizing: boolean;

  // Views feature — the full return value of useTableViews, grouped as one slice
  // Sub-components destructure only what they need:
  //   ctx.views.filters      → FilterChips, DataTableHeader
  //   ctx.views.sorting      → DataTableHeader
  //   ctx.views.activeView   → ViewsBar
  //   ctx.views.saveChanges  → ViewsBar
  views: ReturnType<typeof useTableViews>;

  // Props passed straight through to Body
  isLoading: boolean;
  rowSelection: Record<string, boolean>;

  // Infinite scroll — owned by DataTableContent
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;

  // Selection count — rendered in the toolbar
  totalCount: number;

  // Quick search
  quickSearchEnabled: boolean;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;

  preFilters: FilterRule[]; // ← add
}

// ─────────────────────────────────────────────
// Context — intentionally typed as null so we
// can detect usage outside of a provider
// ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataTableContext =
  createContext<DataTableContextValue<any> | null>(null);

// ─────────────────────────────────────────────
// Hook — typed at the call site via the generic
// ─────────────────────────────────────────────

export function useDataTableContext<TData>(): DataTableContextValue<TData> {
  const ctx = useContext(DataTableContext);

  if (!ctx) {
    throw new Error(
      "useDataTableContext must be used within a <DataTable> component.",
    );
  }

  return ctx as DataTableContextValue<TData>;
}
