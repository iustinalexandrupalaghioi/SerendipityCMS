import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { formatByType } from "@/lib/utils";
import type { Enum } from "@/types/EnumType";
import type { ColumnType } from "../features/filtering/filters";

const TypedCell =
  (type: ColumnType, options?: Enum[]) =>
  ({ getValue }: { getValue: () => unknown }) => {
    const value = getValue();
    const label = formatByType(value, type, options);

    if (type === "boolean")
      return <BooleanDisplay value={value as boolean} title={label} />;
    return <span title={label}>{label}</span>;
  };

export default TypedCell;
