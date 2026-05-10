// FilterPanel.tsx
import {
  OPERATOR_LABELS,
  OPERATORS_BY_TYPE,
  type ColumnType,
  type FilterOperator,
  type FilterRule,
} from "@/components/data-table/features/filtering/filters";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";
import type { Enum } from "@/types/EnumType";
import { format, isValid } from "date-fns";
import { ChevronDownIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnId: string | null;
  columnType: ColumnType | null;
  columnName: string | null;
  selectOptions?: Enum[];
  onApply: (rule: FilterRule) => void;
  initialValue?: FilterRule | null;
  origin?: string;
}

function getDefaultOperator(columnType: ColumnType): FilterOperator {
  if (columnType === "boolean") return "is_true";
  return "equals";
}

function TagInput({
  value,
  onChange,
  placeholder,
  validate,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  validate?: (v: string) => boolean;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const add = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (validate && !validate(trimmed)) {
      setError(true);
      return;
    }
    setError(false);
    if (!value.includes(trimmed)) onChange([...value, trimmed]);
    setInput("");
  };

  const remove = (v: string) => onChange(value.filter((x) => x !== v));

  return (
    <div className="flex flex-col gap-1">
      <div className="flex max-h-48 min-h-9 flex-wrap gap-1 overflow-y-auto rounded-[border-radius] border border-input bg-background px-2 py-1.5 focus-within:ring-1 focus-within:ring-ring">
        {value.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <Input
          className="h-auto min-w-16 flex-1 border-none p-0 shadow-none focus-visible:ring-0"
          placeholder={value.length === 0 ? placeholder : ""}
          value={input}
          onChange={(e) => {
            setError(false);
            setInput(e.target.value);
          }}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text");
            const values = text
              .split(/\r?\n/) // split on line endings only
              .map((line) => line.split("\t")[0]) // if TSV, take first column
              .map((v) => v.trim())
              .filter(Boolean);
            const valid = validate ? values.filter(validate) : values;
            const unique = valid.filter((v) => !value.includes(v));
            if (unique.length) onChange([...value, ...unique]);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(input);
            }
            if (e.key === "Backspace" && input === "" && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => {
            if (input) add(input);
          }}
        />
      </div>
      {error && <p className="text-xs text-destructive">Must be a number</p>}
      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add
      </p>
    </div>
  );
}

function ValueInput({
  operator,
  columnType,
  value,
  onChange,
  selectOptions,
}: {
  operator: FilterOperator;
  columnType: ColumnType;
  value: string | string[];
  onChange: (v: string | string[]) => void;
  selectOptions?: Enum[];
}) {
  const noValueNeeded =
    operator === "is_empty" ||
    operator === "is_not_empty" ||
    operator === "is_true" ||
    operator === "is_false";

  if (noValueNeeded) return null;

  if (operator === "is_any_of" && columnType !== "select") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <TagInput
        value={selected}
        onChange={onChange}
        placeholder={
          columnType === "number" ? "1, 2, 3..." : "value1, value2..."
        }
        validate={
          columnType === "number" ? (v) => !isNaN(Number(v)) : undefined
        }
      />
    );
  }

  // Boolean: single checkbox (only for operators that need a value, which
  // boolean doesn't really have — but guard anyway)
  if (columnType === "boolean") return null;

  // Select: multi-select checkboxes
  if (columnType === "select" && operator === "is_any_of") {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (opt: string) =>
      onChange(
        selected.includes(opt)
          ? selected.filter((v) => v !== opt)
          : [...selected, opt],
      );
    return (
      <div className="flex flex-col gap-2">
        {(selectOptions ?? []).map((opt) => (
          <div key={opt.value} className="grid grid-cols-2 gap-2">
            <Label
              htmlFor={`opt-${opt}`}
              className="cursor-pointer font-normal"
            >
              {opt.label}
            </Label>
            <YesNoSwitch
              id={`opt-${opt}`}
              checked={selected.includes(opt.value)}
              onCheckedChange={() => toggle(opt.value)}
            />
          </div>
        ))}
        {!selectOptions?.length && (
          <p className="text-xs text-muted-foreground">No options available.</p>
        )}
      </div>
    );
  }

  // Select: single value
  if (columnType === "select") {
    return (
      <Select
        value={Array.isArray(value) ? (value[0] ?? "") : value}
        onValueChange={(v) => onChange(v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select value..." />
        </SelectTrigger>
        <SelectContent>
          {(selectOptions ?? []).map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Number: input with error state
  if (columnType === "number") {
    const strValue = Array.isArray(value) ? "" : value;
    const isInvalid = strValue !== "" && isNaN(Number(strValue));
    return (
      <div className="flex flex-col gap-1">
        <Input
          placeholder="Value..."
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={isInvalid}
          className={
            isInvalid ? "border-destructive focus-visible:ring-destructive" : ""
          }
        />
        {isInvalid && (
          <p className="text-xs text-destructive">Must be a number</p>
        )}
      </div>
    );
  }

  // Date
  if (columnType === "date") {
    const selectedDate =
      typeof value === "string" && value ? new Date(value) : undefined;
    const effectiveEndMonth = new Date(
      new Date().getFullYear() + 100,
      new Date().getMonth(),
    );
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="justify-between font-normal"
          >
            {selectedDate && isValid(selectedDate)
              ? format(selectedDate, "dd-MM-yyyy")
              : "Select date"}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            startMonth={selectedDate}
            endMonth={effectiveEndMonth}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (!date) {
                onChange("");
                return;
              }

              const iso = format(date, "yyyy-MM-dd");
              onChange(iso);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }

  // Text (default)
  return (
    <Input
      placeholder="Value..."
      value={Array.isArray(value) ? "" : value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function FilterPanel({
  open,
  onOpenChange,
  columnId,
  columnType,
  columnName,
  selectOptions,
  onApply,
  origin,
  initialValue,
}: FilterPanelProps) {
  const [operator, setOperator] = useState<FilterOperator | "">("");
  const [value, setValue] = useState<string | string[]>("");

  const operators = columnType ? OPERATORS_BY_TYPE[columnType] : [];

  const noValueNeeded =
    operator === "is_empty" ||
    operator === "is_not_empty" ||
    operator === "is_true" ||
    operator === "is_false";

  useEffect(() => {
    if (!open || !columnType) return;

    if (initialValue) {
      setOperator(initialValue.operator);
      setValue(
        initialValue.value === null
          ? initialValue.operator === "is_any_of"
            ? []
            : ""
          : (initialValue.value as string | string[]),
      );
    } else {
      setOperator(getDefaultOperator(columnType));
      setValue(
        columnType === "select" &&
          OPERATORS_BY_TYPE[columnType][0] === "is_any_of"
          ? []
          : "",
      );
    }
  }, [open, columnId, columnType]);
  const handleSave = () => {
    if (!operator || !columnId || !columnType) return;
    if (columnType === "number" && !noValueNeeded) {
      const strValue = Array.isArray(value) ? "" : value;
      if (strValue !== "" && isNaN(Number(strValue))) return;
    }
    onApply({
      columnId,
      columnName: columnName ?? columnId,
      columnType,
      operator,
      origin,
      value: noValueNeeded ? null : value,
    });
    onOpenChange(false);
  };

  // Boolean: render as two radio-style buttons instead of dropdown + checkbox
  const isBooleanType = columnType === "boolean";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" onCloseAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle className="text-base">{columnName ?? ""}</SheetTitle>
          <SheetDescription className="hidden">
            Filter by column
          </SheetDescription>
        </SheetHeader>

        {columnId && columnType && (
          <div className="flex flex-col gap-3 px-4">
            {isBooleanType ? (
              // Boolean: skip operator dropdown, show checkbox with label
              <div className="flex items-center gap-2">
                <YesNoSwitch
                  id="boolean-value"
                  checked={operator === "is_true"}
                  onCheckedChange={(checked) =>
                    setOperator(checked ? "is_true" : "is_false")
                  }
                />
                <Label
                  htmlFor="boolean-value"
                  className="cursor-pointer font-normal hidden"
                >
                  {operator === "is_true" ? "Is true" : "Is false"}
                </Label>
              </div>
            ) : (
              <>
                <Select
                  value={operator}
                  onValueChange={(v) => {
                    setOperator(v as FilterOperator);
                    // Reset value when switching operators
                    setValue(v === "is_any_of" ? [] : "");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition..." />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op} value={op}>
                        {OPERATOR_LABELS[op]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {operator && (
                  <ValueInput
                    operator={operator as FilterOperator}
                    columnType={columnType}
                    value={value}
                    onChange={setValue}
                    selectOptions={selectOptions}
                  />
                )}
              </>
            )}
          </div>
        )}

        <SheetFooter className="mt-6 flex-col gap-2 px-1">
          <Button size="sm" className="w-full" onClick={handleSave}>
            Apply
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
