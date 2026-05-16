export type ColumnType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "datetime"
  | "time";

export type FilterOperator =
  | "contains"
  | "not_contains"
  | "equals"
  | "not_equals"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "is_empty"
  | "is_not_empty"
  | "is_true"
  | "is_false"
  | "is_any_of";

export interface FilterRule {
  columnId: string;
  columnType: ColumnType;
  columnName: string;
  origin?: string;
  operator: FilterOperator;
  value: string | string[] | number | boolean | null;
}

export const OPERATORS_BY_TYPE: Record<ColumnType, FilterOperator[]> = {
  text: [
    "contains",
    "not_contains",
    "equals",
    "not_equals",
    "is_any_of",
    "is_empty",
    "is_not_empty",
  ],
  number: [
    "equals",
    "not_equals",
    "is_any_of",
    "gt",
    "gte",
    "lt",
    "lte",
    "is_empty",
    "is_not_empty",
  ],
  date: [
    "equals",
    "not_equals",
    "is_any_of",
    "gt",
    "gte",
    "lt",
    "lte",
    "is_empty",
    "is_not_empty",
  ],
  datetime: [
    "equals",
    "not_equals",
    "is_any_of",
    "gt",
    "gte",
    "lt",
    "lte",
    "is_empty",
    "is_not_empty",
  ],
  time: [
    "equals",
    "not_equals",
    "is_any_of",
    "gt",
    "gte",
    "lt",
    "lte",
    "is_empty",
    "is_not_empty",
  ],
  boolean: ["is_true", "is_false"],
  select: ["is_any_of", "equals", "not_equals", "is_empty", "is_not_empty"],
};

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  contains: "Contains",
  not_contains: "Does not contain",
  equals: "Equals",
  not_equals: "Does not equal",
  gt: "Greater than",
  gte: "Greater than or equal",
  lt: "Less than",
  lte: "Less than or equal",
  is_empty: "Is empty",
  is_not_empty: "Is not empty",
  is_true: "Is true",
  is_false: "Is false",
  is_any_of: "Is any of",
};

export const applyFilters = <T>(query: T, filters: FilterRule[]): T => {
  for (const filter of filters) {
    const { columnId, columnType, operator, value, origin } = filter;
    const col = origin ? `${origin}.${columnId}` : columnId;

    switch (operator) {
      case "contains":
        query = (query as any).ilike(col, `%${value}%`);
        break;
      case "not_contains":
        query = (query as any).not(col, "ilike", `%${value}%`);
        break;
      case "equals":
        if (columnType === "datetime" && typeof value === "string") {
          query = (query as any)
            .gte(col, `${value}:00`)
            .lte(col, `${value}:59.999`);
        } else {
          query = (query as any).eq(col, value);
        }
        break;
      case "not_equals":
        if (columnType === "datetime" && typeof value === "string") {
          query = (query as any).or(
            `${col}.lt.${value}:00,${col}.gt.${value}:59.999`,
          );
        } else {
          query = (query as any).neq(col, value);
        }
        break;
      case "gt":
        query = (query as any).gt(col, value);
        break;
      case "gte":
        query = (query as any).gte(col, value);
        break;
      case "lt":
        query = (query as any).lt(col, value);
        break;
      case "lte":
        query = (query as any).lte(col, value);
        break;
      case "is_empty":
        query =
          columnType === "text"
            ? (query as any).or(`${col}.is.null,${col}.eq.`)
            : (query as any).is(col, null);
        break;
      case "is_not_empty":
        query =
          columnType === "text"
            ? (query as any).not(col, "is", null).neq(col, "")
            : (query as any).not(col, "is", null);
        break;
      case "is_true":
        query = (query as any).eq(col, true);
        break;
      case "is_false":
        query = (query as any).eq(col, false);
        break;
      case "is_any_of":
        const arr = (value as string[]).map((v) =>
          columnType === "number" ? Number(v) : v,
        );
        if (col.includes(".")) {
          const [table, column] = col.split(".");
          const orConditions = arr
            .map((v) => `${column}.eq.${JSON.stringify(v)}`)
            .join(",");
          query = (query as any).or(orConditions, { foreignTable: table });
        } else {
          query = (query as any).in(col, arr);
        }
        break;
    }
  }
  return query;
};
export type OperatorDisplay = {
  symbol: string;
  valueWrap?: "quotes" | "brackets";
  showValue?: false;
  fixedValue?: string;
};

export function getOperatorDisplay(operator: FilterOperator): OperatorDisplay {
  switch (operator) {
    case "equals":
      return { symbol: "=" };
    case "not_equals":
      return { symbol: "≠" };
    case "contains":
      return { symbol: "~", valueWrap: "quotes" };
    case "not_contains":
      return { symbol: "!~", valueWrap: "quotes" };
    case "gt":
      return { symbol: ">" };
    case "gte":
      return { symbol: "≥" };
    case "lt":
      return { symbol: "<" };
    case "lte":
      return { symbol: "≤" };
    case "is_any_of":
      return { symbol: "∈", valueWrap: "brackets" };
    case "is_empty":
      return { symbol: "=", fixedValue: "Empty" };
    case "is_not_empty":
      return { symbol: "≠", fixedValue: "Empty" };
    case "is_true":
      return { symbol: "=", fixedValue: "Yes" };
    case "is_false":
      return { symbol: "=", fixedValue: "No" };
  }
}

export function formatFilterLabel(rule: FilterRule): string {
  const { symbol, valueWrap, showValue } = getOperatorDisplay(rule.operator);
  const col = rule.columnName;

  if (showValue === false) {
    return `${col} ${symbol}`;
  }

  const raw = Array.isArray(rule.value)
    ? rule.value.join(", ")
    : String(rule.value ?? "");

  const val =
    valueWrap === "quotes"
      ? `"${raw}"`
      : valueWrap === "brackets"
        ? `[${raw}]`
        : raw;

  return `${col} ${symbol} ${val}`;
}
