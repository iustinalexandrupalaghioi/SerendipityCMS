import type { FilterRule } from "@/components/data-table/features/filtering/filters"
import type {
  ColumnSizingState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { useState } from "react"

export interface TableView {
  id: string
  name: string
  columnVisibility: VisibilityState
  columnSizing: ColumnSizingState
  sorting: SortingState
  filters: FilterRule[]
}

interface PersistedViews {
  activeViewId: string
  views: TableView[]
}

const DEFAULT_VIEW_ID = "__default__"

export const initialSorting = (key: string): SortingState => {
  try {
    const raw = localStorage.getItem(`table-views:${key}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      const active =
        parsed.views.find((v: TableView) => v.id === parsed.activeViewId) ??
        parsed.views[0]
      return active?.sorting ?? []
    }
  } catch {}
  return []
}

export const initialFilters = (key: string): FilterRule[] => {
  try {
    const raw = localStorage.getItem(`table-views:${key}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      const active =
        parsed.views.find((v: TableView) => v.id === parsed.activeViewId) ??
        parsed.views[0]
      return active?.filters ?? []
    }
  } catch {}
  return []
}

function loadViews(
  tableId: string,
  initialVisibility: VisibilityState,
  defaultViewName: string
): PersistedViews {
  try {
    const raw = localStorage.getItem(`table-views:${tableId}`)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {
    activeViewId: DEFAULT_VIEW_ID,
    views: [
      {
        id: DEFAULT_VIEW_ID,
        name: defaultViewName,
        columnVisibility: initialVisibility,
        columnSizing: {},
        sorting: [],
        filters: [],
      },
    ],
  }
}

function saveViews(tableId: string, state: PersistedViews) {
  try {
    localStorage.setItem(`table-views:${tableId}`, JSON.stringify(state))
  } catch {}
}

export function useTableViews(
  tableId: string,
  initialColumnVisibility: VisibilityState = {},
  defaultViewName: string = "Default"
) {
  const [persisted, setPersisted] = useState<PersistedViews>(() =>
    loadViews(tableId, initialColumnVisibility, defaultViewName)
  )

  type DraftState = Pick<
    TableView,
    "columnVisibility" | "columnSizing" | "sorting" | "filters"
  >

  const [draft, setDraft] = useState<DraftState | null>(null)

  const makeBase = (prev: DraftState | null): DraftState =>
    prev ?? {
      columnVisibility: activeView.columnVisibility,
      columnSizing: activeView.columnSizing,
      sorting: activeView.sorting ?? [],
      filters: activeView.filters ?? [],
    }

  const setColumnVisibility = (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => {
    setDraft((prev: DraftState | null) => {
      const base = makeBase(prev)
      const next =
        typeof updater === "function" ? updater(base.columnVisibility) : updater
      return { ...base, columnVisibility: next }
    })
  }

  const setColumnSizing = (
    updater: ColumnSizingState | ((old: ColumnSizingState) => ColumnSizingState)
  ) => {
    setDraft((prev: DraftState | null) => {
      const base = makeBase(prev)
      const next =
        typeof updater === "function" ? updater(base.columnSizing) : updater
      return { ...base, columnSizing: next }
    })
  }

  const setSorting = (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => {
    setDraft((prev: DraftState | null) => {
      const base = makeBase(prev)
      const next =
        typeof updater === "function" ? updater(base.sorting) : updater
      return { ...base, sorting: next }
    })
  }

  const setFilters = (
    updater: FilterRule[] | ((old: FilterRule[]) => FilterRule[])
  ) => {
    setDraft((prev: DraftState | null) => {
      const base = makeBase(prev)
      const next =
        typeof updater === "function" ? updater(base.filters) : updater
      return { ...base, filters: next }
    })
  }

  const activeView =
    persisted.views.find((v) => v.id === persisted.activeViewId) ??
    persisted.views[0]

  const hasChanges = draft !== null

  const columnVisibility =
    draft?.columnVisibility ?? activeView.columnVisibility
  const columnSizing = draft?.columnSizing ?? activeView.columnSizing
  const sorting = draft?.sorting ?? activeView.sorting ?? []
  const filters = draft?.filters ?? activeView.filters ?? []

  const updatePersisted = (next: PersistedViews) => {
    setPersisted(next)
    saveViews(tableId, next)
  }

  const saveChanges = () => {
    if (!draft) return
    updatePersisted({
      ...persisted,
      views: persisted.views.map((v) =>
        v.id === activeView.id ? { ...v, ...draft } : v
      ),
    })
    setDraft(null)
  }

  const discardChanges = () => setDraft(null)

  const saveAsView = (name: string) => {
    const newView: TableView = {
      id: crypto.randomUUID(),
      name,
      columnVisibility,
      columnSizing,
      sorting,
      filters,
    }
    updatePersisted({
      activeViewId: newView.id,
      views: [...persisted.views, newView],
    })
    setDraft(null)
  }

  const switchView = (id: string) => {
    updatePersisted({ ...persisted, activeViewId: id })
    setDraft(null)
  }

  const deleteView = (id: string) => {
    if (id === DEFAULT_VIEW_ID) return
    const remaining = persisted.views.filter((v) => v.id !== id)
    updatePersisted({
      activeViewId: remaining.at(-1)?.id ?? DEFAULT_VIEW_ID,
      views: remaining,
    })
    setDraft(null)
  }

  const renameView = (id: string, name: string) => {
    updatePersisted({
      ...persisted,
      views: persisted.views.map((v) => (v.id === id ? { ...v, name } : v)),
    })
  }

  return {
    views: persisted.views,
    activeView,
    columnVisibility,
    columnSizing,
    sorting,
    filters,
    hasChanges,
    setColumnVisibility,
    setColumnSizing,
    setSorting,
    setFilters,
    saveChanges,
    discardChanges,
    saveAsView,
    switchView,
    deleteView,
    renameView,
  }
}
