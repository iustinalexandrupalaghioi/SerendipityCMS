import { Badge } from "@/components/ui/badge";
import {
  OPERATOR_LABELS,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import { X } from "lucide-react";
import { useDataTableContext } from "../../DataTableContext";
import { format } from "date-fns";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatFilterValue(rule: FilterRule): string {
  const noValue =
    rule.operator === "is_empty" ||
    rule.operator === "is_not_empty" ||
    rule.operator === "is_true" ||
    rule.operator === "is_false";

  if (noValue) return "";

  // ✅ Handle date formatting
  if (rule.columnType === "date") {
    if (!rule.value) return "";

    try {
      return format(new Date(rule.value as string), "dd-MM-yyyy");
    } catch {
      return String(rule.value);
    }
  }

  if (Array.isArray(rule.value))
    return rule.value.length > 0 ? rule.value.join(", ") : "";

  if (rule.value === null || rule.value === undefined) return "";

  return String(rule.value);
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
  const formattedValue = formatFilterValue(rule);

  const operatorLabel = OPERATOR_LABELS[rule.operator];

  return (
    <Badge
      variant="outline"
      className="flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 py-0 text-sm font-normal"
      title={`${rule.columnName} ${operatorLabel.toLowerCase()}${formattedValue ? ` ${formattedValue}` : ""}`}
      onClick={!locked ? onEdit : undefined}
    >
      <span className="font-medium">{rule.columnName}</span>
      <span className="text-muted-foreground">
        {operatorLabel.toLowerCase()}
      </span>
      {formattedValue && (
        <span className="max-w-30 truncate">{formattedValue}</span>
      )}
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
    // DataTableHeader owns the filter drawer state internally.
    // We use a custom event so the header can open its drawer
    // without lifting that state into context.
    window.dispatchEvent(
      new CustomEvent("datatable:open-filter", { detail: { columnId } }),
    );
  };

  const handleRemove = (columnId: string) => {
    setFilters((prev) => prev.filter((f) => f.columnId !== columnId));
  };

  const handleClearAll = () => {
    setFilters([]);
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
          onClick={handleClearAll}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
