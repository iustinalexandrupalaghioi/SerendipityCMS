import { Badge } from "@/components/ui/badge";
import {
  getOperatorDisplay,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import { X } from "lucide-react";
import { useDataTableContext } from "../../DataTableContext";
import { formatByType } from "@/lib/utils";
import type { Enum } from "@/types/EnumType";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatChipValue(
  rule: FilterRule,
  selectOptions?: Enum[],
): string | null {
  const { showValue, valueWrap, fixedValue } = getOperatorDisplay(
    rule.operator,
  );

  if (showValue === false) return null;
  if (fixedValue) return fixedValue;

  if (rule.value) {
    const raw = Array.isArray(rule.value)
      ? rule.value
          .map((v) => formatByType(v, rule.columnType, selectOptions))
          .join(", ")
      : formatByType(rule.value as string, rule.columnType, selectOptions);

    return valueWrap === "quotes"
      ? `"${raw}"`
      : valueWrap === "brackets"
        ? `[${raw}]`
        : raw;
  }

  return null;
}

// ─────────────────────────────────────────────
// FilterChip — single pill (internal)
// ─────────────────────────────────────────────

function FilterChip({
  rule,
  onRemove,
  onEdit,
  locked = false,
  selectOptions,
}: {
  rule: FilterRule;
  onRemove: () => void;
  onEdit: () => void;
  locked?: boolean;
  selectOptions?: Enum[];
}) {
  const { symbol } = getOperatorDisplay(rule.operator);
  const value = formatChipValue(rule, selectOptions);

  return (
    <Badge
      variant="outline"
      className="flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 py-0 text-sm font-normal"
      title={[rule.columnName, symbol, value].filter(Boolean).join(" ")}
      onClick={!locked ? onEdit : undefined}
    >
      <span className="font-medium">{rule.columnName}</span>
      <span className="text-muted-foreground">{symbol}</span>
      {value && <span className="max-w-30 truncate">{value}</span>}
      {!locked && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title={`Remove filter on ${rule.columnName}`}
          className="ml-0.5 rounded-sm opacity-60 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
          aria-label={`Remove filter on ${rule.columnName}`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Badge>
  );
}

// ─────────────────────────────────────────────
// FilterChips — context-aware, no props
// ─────────────────────────────────────────────

export function FilterChips() {
  const { views, preFilters, table } = useDataTableContext();
  const { filters, setFilters } = views;

  const isLocked = (filter: FilterRule) =>
    preFilters.some(
      (p) => p.columnId === filter.columnId && p.operator === filter.operator,
    );

  if (filters.length === 0) return null;

  const handleEdit = (columnId: string) => {
    window.dispatchEvent(
      new CustomEvent("datatable:open-filter", { detail: { columnId } }),
    );
  };

  const handleRemove = (columnId: string) => {
    setFilters((prev) => prev.filter((f) => f.columnId !== columnId));
  };

  const removableCount = filters.filter((f) => !isLocked(f)).length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {filters.map((rule) => {
        const meta = table.getColumn(rule.columnId)?.columnDef?.meta;
        const selectOptions = meta?.selectOptions;

        return (
          <FilterChip
            key={rule.columnId}
            rule={rule}
            selectOptions={selectOptions}
            onRemove={() => handleRemove(rule.columnId)}
            onEdit={() => handleEdit(rule.columnId)}
            locked={isLocked(rule)}
          />
        );
      })}
      {removableCount > 1 && (
        <button
          onClick={() => setFilters([])}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
