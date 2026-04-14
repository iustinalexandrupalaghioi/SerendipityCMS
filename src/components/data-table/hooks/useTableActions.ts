import { useMemo, type ReactNode } from "react"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

/**
 * A single action definition — same shape as RowAction in DataTableBody
 * but generic over your own row data type, not TanStack's Row<TData>.
 *
 * Define these once (e.g. in a constants file or alongside your columns)
 * and share them between the toolbar and the context menu.
 *
 * @example
 * export const ORDER_ACTIONS: TableAction<Order>[] = [
 *   {
 *     label:      "Approve",
 *     isEligible: (row) => row.status !== "approved",
 *     onSelect:   (rows) => approveMany(rows.map(r => r.id)),
 *   },
 *   {
 *     label:      "Delete",
 *     isEligible: () => true,
 *     onSelect:   (rows) => deleteMany(rows.map(r => r.id)),
 *     destructive: true,
 *   },
 * ]
 */
export interface TableAction<TData> {
  label: ReactNode
  isEligible?: (row: TData) => boolean
  onSelect: (eligibleRows: TData[]) => void
  destructive?: boolean
}

/**
 * What the hook returns — ready to bind to a toolbar button.
 */
export interface ResolvedToolbarAction<_TData> {
  /** "Approve 5/6", "Approve" when single or no selection */
  label: ReactNode
  onSelect: () => void
  destructive?: boolean
  /** Bind to the button's disabled prop */
  disabled: boolean
  eligibleCount: number
  selectedCount: number
}

// ─────────────────────────────────────────────
// useTableActions
//
// Resolves eligibility counts for a list of actions against
// a selection you manage yourself (Object.keys(rowSelection)
// mapped to your actual row data).
//
// No TanStack dependency — pass your own TData[].
//
// Usage:
//
//   const selectedRows = Object.keys(rowSelection)
//     .map(id => data.find(r => r.id === id))
//     .filter(Boolean) as Order[]
//
//   const actions = useTableActions(ORDER_ACTIONS, selectedRows)
//
//   <Button
//     key={action.label}
//     disabled={action.disabled}
//     onClick={action.onSelect}
//     variant={action.destructive ? "destructive" : "outline"}
//   >
//     {action.label}
//   </Button>
// ─────────────────────────────────────────────

export function useTableActions<TData>(
  actions: TableAction<TData>[],
  selectedRows: TData[]
): ResolvedToolbarAction<TData>[] {
  return useMemo(() => {
    const noSelection = selectedRows.length === 0
    const isMulti = selectedRows.length > 1

    return actions.map((action): ResolvedToolbarAction<TData> => {
      if (noSelection) {
        return {
          label: action.label,
          onSelect: () => {},
          destructive: action.destructive,
          disabled: true,
          eligibleCount: 0,
          selectedCount: 0,
        }
      }

      const eligibleRows = action.isEligible
        ? selectedRows.filter(action.isEligible)
        : selectedRows

      const eligible = eligibleRows.length
      const total = selectedRows.length

      return {
        label: isMulti ? `${action.label} ${eligible}/${total}` : action.label,
        onSelect: () => action.onSelect(eligibleRows),
        destructive: action.destructive,
        disabled: eligible === 0,
        eligibleCount: eligible,
        selectedCount: total,
      }
    })
  }, [actions, selectedRows])
}
