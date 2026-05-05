import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { FilterRule } from "@/components/data-table/features/filtering/filters";
import {
  Clipboard,
  ExternalLink,
  FilterX,
  Link,
  ListFilter,
  Settings,
  Trash2,
} from "lucide-react";
import { memo, useEffect, useState, type RefObject } from "react";
import type { ContextMenuState, ResolvedAction } from "./types";
import { createPortal } from "react-dom";

interface CellContextMenuProps<TData> {
  state: ContextMenuState<TData> | null;
  onClose: () => void;
  selectedCellValuesRef: RefObject<() => string>;
  allSelectedIds: string[];
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function dispatchFilterEvent(rule: FilterRule) {
  window.dispatchEvent(
    new CustomEvent("datatable:apply-filter", { detail: { rule } }),
  );
}

function buildFilterRule(
  state: ContextMenuState<unknown>,
  operator: "equals" | "not_equals",
): FilterRule | null {
  const { columnId, columnType, columnName, copyValue, origin } = state;

  if (!columnType) return null;
  if (copyValue === null || copyValue === undefined || copyValue === "")
    return null;

  if (columnType === "boolean") {
    const boolOperator =
      copyValue === true || copyValue === "true"
        ? operator === "equals"
          ? "is_true"
          : "is_false"
        : operator === "equals"
          ? "is_false"
          : "is_true";

    return {
      columnId,
      columnType,
      columnName,
      operator: boolOperator,
      value: null,
      origin,
    };
  }

  return {
    columnId,
    columnType,
    columnName,
    operator,
    value: String(copyValue),
    origin,
  };
}
// ─────────────────────────────────────────────
// CellContextMenu
// ─────────────────────────────────────────────

function CellContextMenuInner<TData>({
  state,
  onClose,
  selectedCellValuesRef,
  allSelectedIds,
}: CellContextMenuProps<TData>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state) setOpen(true);
  }, [state]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) onClose();
  };

  if (!state) return null;

  const {
    x,
    y,
    copyValue,
    copyUrl,
    effectiveRows,
    isMulti,
    onOpen,
    deleteAction,
    actions,
  } = state;

  const handleCopyValue = () => {
    // Cell selection always wins — covers both single and multi-cell TSV
    const tsv = selectedCellValuesRef.current?.();
    if (tsv) {
      navigator.clipboard.writeText(tsv);
      return;
    }

    // Fall back to row IDs when multiple rows are selected but no cells
    if (isMulti) {
      navigator.clipboard.writeText(allSelectedIds.join("\n"));
      return;
    }

    // Single cell fallback from context menu state
    if (copyValue == null) return;
    const text =
      typeof copyValue === "boolean"
        ? copyValue
          ? "Yes"
          : "No"
        : String(copyValue);
    navigator.clipboard.writeText(text);
  };

  // ── Filter actions — only available for single row, non-empty value ──
  const filterRule = !isMulti
    ? buildFilterRule(state as ContextMenuState<unknown>, "equals")
    : null;
  const excludeRule = !isMulti
    ? buildFilterRule(state as ContextMenuState<unknown>, "not_equals")
    : null;
  const hasFilterActions = !!filterRule || !!excludeRule;

  const hasActions = actions.length > 0;
  const hasMidSection = hasActions || !!deleteAction;

  const countEligibleActions = (actions: ResolvedAction[]) => {
    return actions.reduce((count, action) => {
      return action.disabled ? count : count + 1;
    }, 0);
  };

  return createPortal(
    <DropdownMenu open={open} onOpenChange={handleOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <div
          style={{
            position: "fixed",
            left: x,
            top: y,
            width: 0,
            height: 0,
            padding: 0,
            border: "none",
            background: "transparent",
            outline: "none",
            pointerEvents: "none",
          }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-fit"
        align="start"
        sideOffset={2}
        alignOffset={-4}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {/* ── Open ── */}
        {onOpen && (
          <>
            <DropdownMenuItem onSelect={() => onOpen(effectiveRows)}>
              <ExternalLink className="h-4 w-4" />
              {isMulti ? `Open (${effectiveRows.length})` : "Open"}
            </DropdownMenuItem>
          </>
        )}

        {/* ── Actions submenu ── */}
        {hasActions && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className={cn(
                countEligibleActions(actions) === 0 && "text-muted-foreground",
              )}
              disabled={countEligibleActions(actions) === 0}
            >
              <Settings className="h-4 w-4" />
              Actions
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {actions.map((action, i) => {
                const isEligible = !action.disabled;
                if (isEligible)
                  return (
                    <DropdownMenuItem
                      key={i}
                      disabled={action.disabled}
                      onSelect={action.onSelect}
                      className={cn(
                        action.destructive &&
                          "text-destructive focus:text-destructive",
                      )}
                    >
                      {action.label}
                    </DropdownMenuItem>
                  );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        {/* ── Delete ── */}
        {deleteAction && (
          <DropdownMenuItem
            disabled={deleteAction.disabled}
            onSelect={deleteAction.onSelect}
          >
            <Trash2 className="h-4 w-4" />
            {deleteAction.label}
          </DropdownMenuItem>
        )}

        {/* ── Filter actions ── */}
        {hasFilterActions && (
          <>
            <DropdownMenuSeparator />
            {filterRule && (
              <DropdownMenuItem
                onSelect={() => dispatchFilterEvent(filterRule)}
              >
                <ListFilter className="h-4 w-4" />
                Filter by this value
              </DropdownMenuItem>
            )}
            {excludeRule && (
              <DropdownMenuItem
                onSelect={() => dispatchFilterEvent(excludeRule)}
              >
                <FilterX className="h-4 w-4" />
                Exclude this value
              </DropdownMenuItem>
            )}
          </>
        )}

        {/* ── Separator before actions / delete ── */}
        {hasMidSection && <DropdownMenuSeparator />}

        {/* ── Copy cell value ── */}
        <DropdownMenuItem
          onSelect={handleCopyValue}
          disabled={copyValue == null}
        >
          <Clipboard className="h-4 w-4" />
          Copy to clipboard
        </DropdownMenuItem>

        {/* ── Copy link ── */}
        {copyUrl && (
          <DropdownMenuItem
            onSelect={() => {
              if (isMulti) {
                const urls = effectiveRows
                  .map((row) => {
                    const col = Object.values(row.getAllCells()).find(
                      (c) => c.column.columnDef.meta?.getRowUrl,
                    );
                    return col?.column.columnDef.meta?.getRowUrl?.(row);
                  })
                  .filter(Boolean)
                  .join("\n");
                navigator.clipboard.writeText(urls);
              } else {
                navigator.clipboard.writeText(copyUrl);
              }
            }}
          >
            <Link className="h-4 w-4" />
            {isMulti ? `Copy links (${effectiveRows.length})` : "Copy link"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>,
    document.body,
  );
}

export const CellContextMenu = memo(
  CellContextMenuInner,
) as typeof CellContextMenuInner;
