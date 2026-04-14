export type ColumnType = "text" | "number" | "date" | "boolean" | "select";

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
  operator: FilterOperator;
  value: string | string[] | number | boolean | null;
}

export const OPERATORS_BY_TYPE: Record<ColumnType, FilterOperator[]> = {
  text: [
    "contains",
    "not_contains",
    "equals",
    "not_equals",
    "is_any_of", // ← add
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
    const { columnId, columnType, operator, value } = filter;
    switch (operator) {
      case "contains":
        query = (query as any).ilike(columnId, `%${value}%`);
        break;
      case "not_contains":
        query = (query as any).not(columnId, "ilike", `%${value}%`);
        break;
      case "equals":
        query = (query as any).eq(columnId, value);
        break;
      case "not_equals":
        query = (query as any).neq(columnId, value);
        break;
      case "gt":
        query = (query as any).gt(columnId, value);
        break;
      case "gte":
        query = (query as any).gte(columnId, value);
        break;
      case "lt":
        query = (query as any).lt(columnId, value);
        break;
      case "lte":
        query = (query as any).lte(columnId, value);
        break;
      case "is_empty":
        query =
          columnType === "text"
            ? (query as any).or(`${columnId}.is.null,${columnId}.eq.`)
            : (query as any).is(columnId, null);
        break;
      case "is_not_empty":
        query =
          columnType === "text"
            ? (query as any).not(columnId, "is", null).neq(columnId, "")
            : (query as any).not(columnId, "is", null);
        break;
      case "is_true":
        query = (query as any).eq(columnId, true);
        break;
      case "is_false":
        query = (query as any).eq(columnId, false);
        break;
      case "is_any_of":
        const arr = (value as string[]).map((v) =>
          filter.columnType === "number" ? Number(v) : v,
        );
        query = (query as any).in(columnId, arr);
        break;
    }
  }
  return query;
};
