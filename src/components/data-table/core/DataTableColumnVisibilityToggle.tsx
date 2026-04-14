import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import type { Table } from "@tanstack/react-table";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function DataTableColumnvisibilityToggle<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const [search, setSearch] = useState("");

  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide(),
    )
    .filter((column) => column.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <DropdownMenu modal={false} onOpenChange={() => setSearch("")}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-fit">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="ms-10 max-h-64 min-w-48 bg-card"
      >
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="mt-2 px-2 pb-2">
          <Input
            placeholder="Search columns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            className="h-7 text-xs"
          />
        </div>
        <DropdownMenuSeparator />
        <div className="overflow-y-auto">
          {columns.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              No columns found
            </p>
          ) : (
            columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="min-w-max"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                onSelect={(e) => e.preventDefault()}
              >
                {column.columnDef.meta?.columnName ?? column.id}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
