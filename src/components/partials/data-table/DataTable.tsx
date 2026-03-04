import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Enum } from "@/types/EnumType";
import { SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Combobox } from "../Combobox";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableViewOptions } from "./DataTableViewOptions";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    className?: string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface ExtendedDataTableProps<TData, TValue> extends DataTableProps<
  TData,
  TValue
> {
  filterTextColumns?: string[];
  filterTextPlaceholders?: string[];
  filterTextLabels?: string[];
  filterEnumColumns?: string[];
  filterEnumPlaceholders?: string[];
  filterEnumLabels?: string[];
  enums?: Enum[][] | any[];
  rowSelection?: any;
  setRowSelection?: (object: any) => void;
}

function DataTable<TData, TValue>({
  columns,
  data,
  filterTextColumns = [],
  filterTextPlaceholders = [],
  filterEnumColumns = [],
  filterTextLabels = [],
  filterEnumLabels = [],
  filterEnumPlaceholders = [],
  enums = [],
  rowSelection,

  setRowSelection,
}: ExtendedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTexts, setSearchTexts] = useState<Record<string, string>>({});
  const [selectedEnumValues, setSelectedEnumValues] = useState<
    Record<string, string>
  >({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filterTextColumnsCondition =
    filterTextColumns.length > 0 && filterTextPlaceholders.length > 0;
  const filterEnumColumnsCondition =
    filterEnumColumns.length > 0 &&
    enums.length > 0 &&
    filterEnumPlaceholders.length > 0;
  const filterLayoutCondition =
    filterTextColumns.length + filterEnumColumns.length > 1;
  const showFilters = filterTextColumnsCondition || filterEnumColumnsCondition;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    enableColumnResizing: true,
    columnResizeMode: "onChange",

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,

    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;

      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },

    state: {
      sorting,
      columnFilters,
      rowSelection: rowSelection ?? {},
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-2">
        <div className="flex flex-col gap-4">
          {showFilters && (
            <div
              className={cn(
                "flex flex-col md:flex-row flex-wrap gap-4",
                filterLayoutCondition ? "lg:max-w-4xl" : "max-w-full",
              )}
            >
              {/* Filter Inputs */}
              {filterTextColumnsCondition &&
                filterTextColumns.map((column, index) => (
                  <div className="relative space-y-1" key={column}>
                    <Label
                      htmlFor={column}
                      className="block mb-1 text-sm font-medium"
                    >
                      {filterTextLabels[index]}
                    </Label>

                    <div className="relative">
                      {/* Left search icon */}
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="text-muted-foreground h-4 w-4" />
                      </span>

                      <Input
                        id={column}
                        placeholder={filterTextPlaceholders[index]}
                        value={searchTexts[column] || ""}
                        onChange={(event) => {
                          const newSearchTexts = {
                            ...searchTexts,
                            [column]: event.target.value,
                          };
                          setSearchTexts(newSearchTexts);
                          table
                            .getColumn(column)
                            ?.setFilterValue(event.target.value);
                        }}
                        className="pl-10 pr-8 md:min-w-xs"
                      />

                      {/* Right clear button */}
                      {searchTexts[column] && (
                        <button
                          type="button"
                          aria-label="Clear search text"
                          title="Clear search text"
                          onClick={() => {
                            const newSearchTexts = { ...searchTexts };
                            delete newSearchTexts[column];
                            setSearchTexts(newSearchTexts);
                            table.getColumn(column)?.setFilterValue(undefined);
                          }}
                          className="absolute inset-y-0 right-0 flex items-center pr-2"
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

              {filterEnumColumnsCondition && (
                <div className="flex flex-wrap gap-4">
                  {filterEnumColumns.map((column, index) => {
                    const enumOptions = enums[index];

                    // Map enum options to Combobox format
                    const comboboxItems = enumOptions.map(
                      ({ value, label }: Enum) => ({
                        value,
                        label,
                      }),
                    );

                    return (
                      <div className="flex flex-col space-y-1" key={column}>
                        <Label
                          htmlFor={column}
                          className="block mb-1 text-sm font-medium"
                        >
                          {filterEnumLabels[index]}
                        </Label>

                        <Combobox
                          items={comboboxItems}
                          value={selectedEnumValues[column] ?? ""}
                          placeholder={filterEnumPlaceholders[index]}
                          onChange={(value) => {
                            const newSelectedEnumValues = {
                              ...selectedEnumValues,
                              [column]: value,
                            };
                            setSelectedEnumValues(newSelectedEnumValues);
                            table
                              .getColumn(column)
                              ?.setFilterValue(
                                value === "" ? undefined : value,
                              );
                          }}
                          className="w-[200px]" // adjust width as needed
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <DataTableViewOptions table={table} />
      </div>

      <Table className="table-fixed w-full border-collapse">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className={cn(
                    "relative h-10 px-3 text-xs font-medium text-muted-foreground",
                    "whitespace-nowrap overflow-hidden select-none",
                    "border-r last:border-r-0",
                    header.column.columnDef.meta?.className,
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span title={header.id} className="truncate">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </span>
                  </div>

                  {/* Resize handle */}
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onDoubleClick={() => header.column.resetSize()}
                      onTouchStart={header.getResizeHandler()}
                      className={cn(
                        "absolute right-0 top-0 h-full w-1 cursor-col-resize",
                        "bg-transparent hover:bg-primary/30",
                        header.column.getIsResizing() && "bg-primary",
                      )}
                    />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="odd:bg-muted/40"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    onDoubleClick={() => {
                      const value = cell.getValue();
                      if (value != null) {
                        navigator.clipboard.writeText(String(value));
                        toast.success("Copied to clipboard");
                      }
                    }}
                    key={cell.id}
                    title={
                      typeof cell.getValue() === "boolean"
                        ? cell.getValue()
                          ? "Yes"
                          : "No"
                        : String(cell.getValue() ?? "")
                    }
                    style={{ width: cell.column.getSize() }}
                    className={cn(
                      "relative h-9 px-3 text-xs",
                      "whitespace-nowrap overflow-hidden truncate",
                      cell.column.columnDef.meta?.className,
                    )}
                  >
                    <div className="min-w-0 truncate">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        table={table}
      />
    </div>
  );
}

export default DataTable;
