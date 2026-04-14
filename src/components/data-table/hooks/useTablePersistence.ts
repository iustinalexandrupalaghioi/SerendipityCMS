import { useState } from "react"
import type {
  VisibilityState,
  ColumnSizingState,
  SortingState,
} from "@tanstack/react-table"
import type { FilterRule } from "@/components/data-table/features/filtering/filters"

interface PersistedTableState {
  columnVisibility: VisibilityState
  columnSizing: ColumnSizingState
  sorting: SortingState
  filters: FilterRule[]
}

function loadState(
  tableId: string,
  initial: VisibilityState
): PersistedTableState {
  try {
    const raw = localStorage.getItem(`table:${tableId}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        columnSizing: {},
        sorting: [],
        filters: [],
        ...parsed,
        columnVisibility: parsed.columnVisibility ?? initial,
      }
    }
  } catch {}
  return {
    columnVisibility: initial,
    columnSizing: {},
    sorting: [],
    filters: [],
  }
}

function saveState(tableId: string, state: PersistedTableState) {
  try {
    localStorage.setItem(`table:${tableId}`, JSON.stringify(state))
  } catch {}
}

export function useTablePersistence(
  tableId: string,
  initialColumnVisibility: VisibilityState = {}
) {
  const [state, setState] = useState<PersistedTableState>(() =>
    loadState(tableId, initialColumnVisibility)
  )
  const [_, setSavedFilters] = useState<FilterRule[]>(
    () => loadState(tableId, initialColumnVisibility).filters
  )

  const update = <K extends keyof PersistedTableState>(
    key: K,
    updater:
      | PersistedTableState[K]
      | ((old: PersistedTableState[K]) => PersistedTableState[K])
  ) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev[key]) : updater
      const newState = { ...prev, [key]: next }
      saveState(tableId, newState)
      return newState
    })
  }

  // Filters get a draft layer — everything else auto-saves immediately
  const [draftFilters, setDraftFilters] = useState<FilterRule[] | null>(null)

  const setFilters = (
    updater: FilterRule[] | ((old: FilterRule[]) => FilterRule[])
  ) => {
    setDraftFilters((prev) => {
      const base = prev ?? state.filters
      return typeof updater === "function" ? updater(base) : updater
    })
  }

  const saveFilters = () => {
    if (draftFilters === null) return
    update("filters", draftFilters)
    setSavedFilters(draftFilters)
    setDraftFilters(null)
  }

  const discardFilters = () => setDraftFilters(null)

  const filters = draftFilters ?? state.filters
  const hasChanges = draftFilters !== null

  return {
    columnVisibility: state.columnVisibility,
    columnSizing: state.columnSizing,
    sorting: state.sorting,
    filters,
    hasChanges,
    setColumnVisibility: (
      u: VisibilityState | ((o: VisibilityState) => VisibilityState)
    ) => update("columnVisibility", u),
    setColumnSizing: (
      u: ColumnSizingState | ((o: ColumnSizingState) => ColumnSizingState)
    ) => update("columnSizing", u),
    setSorting: (u: SortingState | ((o: SortingState) => SortingState)) =>
      update("sorting", u),
    setFilters,
    saveFilters,
    discardFilters,
  }
}
