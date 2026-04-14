import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnType } from "@/components/data-table/features/filtering/filters";
import type { SortRule } from "@/components/data-table/features/views/sort";
import {
  ArrowDownIcon,
  ArrowDownZaIcon,
  ArrowUpAzIcon,
  ArrowUpIcon,
  FilterIcon,
  X,
} from "lucide-react";

interface DataTableHeaderDropdownProps {
  columnId: string;
  columnName: string | null;
  columnType: ColumnType | null;
  canSort: boolean;
  sorting: SortRule[];
  sortRule: SortRule | null;
  sortIndex: number;
  isMultiSort: boolean;
  onPrimarySort: (columnId: string, desc: boolean) => void;
  onAlsoSort: (columnId: string, desc: boolean) => void;
  onClearSort: (columnId: string) => void;
  handleOpenFilterDrawer: (
    columnId: string,
    columnType: ColumnType | null,
    selectOptions?: string[],
    columnName?: string | null,
  ) => void;
  selectOptions?: string[];
}

export function DataTableHeaderDropdown({
  columnId,
  columnType,
  columnName,
  canSort,
  sorting,
  sortRule,
  sortIndex,
  isMultiSort,
  onPrimarySort,
  onAlsoSort,
  onClearSort,
  handleOpenFilterDrawer,
  selectOptions,
}: DataTableHeaderDropdownProps) {
  const SortIcon = sortRule
    ? sortRule.desc
      ? ArrowDownIcon
      : ArrowUpIcon
    : null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full cursor-pointer items-center gap-0.5 rounded p-0.5 focus:outline-none">
          <span>{columnName}</span>
          {SortIcon && <SortIcon className="h-3 w-3 shrink-0" />}
          {isMultiSort && sortRule && (
            <span className="text-[10px] leading-none">{sortIndex + 1}</span>
          )}
        </button>
      </DropdownMenuTrigger>

      {canSort && (
        <DropdownMenuContent align="start" className="w-44">
          {sortRule?.desc !== false ? (
            <DropdownMenuItem onClick={() => onPrimarySort(columnId, false)}>
              <ArrowUpAzIcon className="mr-2 h-3.5 w-3.5" />
              Sort ascending
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => onClearSort(columnId)}
              className=""
            >
              <X className="mr-2 h-3.5 w-3.5" />
              Remove sort
            </DropdownMenuItem>
          )}

          {sortRule?.desc !== true ? (
            <DropdownMenuItem onClick={() => onPrimarySort(columnId, true)}>
              <ArrowDownZaIcon className="mr-2 h-3.5 w-3.5" />
              Sort descending
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => onClearSort(columnId)}
              className=""
            >
              <X className="mr-2 h-3.5 w-3.5" />
              Remove sort
            </DropdownMenuItem>
          )}

          {sorting.length > 0 && (
            <>
              <DropdownMenuItem
                onClick={() => onAlsoSort(columnId, false)}
                disabled={sortRule?.desc === false && !isMultiSort}
              >
                <ArrowUpAzIcon className="mr-2 h-3.5 w-3.5" />
                Also sort ascending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAlsoSort(columnId, true)}
                disabled={sortRule?.desc === true && !isMultiSort}
              >
                <ArrowDownZaIcon className="mr-2 h-3.5 w-3.5" />
                Also sort descending
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onSelect={() => {
              handleOpenFilterDrawer(
                columnId,
                columnType,
                selectOptions,
                columnName ?? columnId,
              );
            }}
          >
            <FilterIcon className="mr-2 h-3.5 w-3.5" />
            Add filter
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
