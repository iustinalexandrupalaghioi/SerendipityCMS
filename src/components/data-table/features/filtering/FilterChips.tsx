import { Badge } from "@/components/ui/badge";
import {
  getOperatorDisplay,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import { X } from "lucide-react";
import { useDataTableContext } from "../../DataTableContext";
import { format } from "date-fns";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatChipValue(rule: FilterRule): string | null {
  const { showValue, valueWrap, fixedValue } = getOperatorDisplay(
    rule.operator,
  );

  if (showValue === false) return null;
  if (fixedValue) return fixedValue;

  if (rule.columnType === "date" && rule.value) {
    try {
      const raw = Array.isArray(rule.value)
        ? rule.value.map((v) => format(new Date(v), "dd-MM-yyyy")).join(", ")
        : format(new Date(rule.value as string), "dd-MM-yyyy");
      return valueWrap === "brackets" ? `[${raw}]` : raw;
    } catch {
      /* fall through to generic path */
    }
  }

  const raw = Array.isArray(rule.value)
    ? rule.value.join(", ")
    : rule.value != null
      ? String(rule.value)
      : "";

  if (!raw) return null;

  return valueWrap === "quotes"
    ? `"${raw}"`
    : valueWrap === "brackets"
      ? `[${raw}]`
      : raw;
}

// ─────────────────────────────────────────────
// FilterChip — single pill (internal)
// ─────────────────────────────────────────────

function FilterChip({
  rule,
  onRemove,
  onEdit,
  locked = false,
}: {
  rule: FilterRule;
  onRemove: () => void;
  onEdit: () => void;
  locked?: boolean;
}) {
  const { symbol } = getOperatorDisplay(rule.operator);
  const value = formatChipValue(rule);

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
  const { views, preFilters } = useDataTableContext();
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
      {filters.map((rule) => (
        <FilterChip
          key={rule.columnId}
          rule={rule}
          onRemove={() => handleRemove(rule.columnId)}
          onEdit={() => handleEdit(rule.columnId)}
          locked={isLocked(rule)}
        />
      ))}
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
