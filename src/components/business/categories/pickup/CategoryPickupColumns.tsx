import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { DataTableColumnvisibilityToggle } from "@/components/data-table/core/DataTableColumnVisibilityToggle";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/Category";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { ChevronLeftIcon } from "lucide-react";

export const pickupCategoryColumnVisibility: VisibilityState = {
  id: true,
  name: true,
  description: true,
  is_active: true,
};

export function createPickupCategoryColumns(
  onSelect: (category: Category) => void,
): ColumnDef<Category>[] {
  return [
    {
      id: "select",
      size: 40,
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => <DataTableColumnvisibilityToggle table={table} />,
      cell: ({ row }) => (
        <Button
          className="w-fit"
          variant="ghost"
          title="Select this category"
          onClick={() => onSelect(row.original)}
        >
          <ChevronLeftIcon />
        </Button>
      ),
      meta: { className: "p-0" },
    },
    {
      id: "display_id",
      accessorKey: "display_id",
      header: undefined,
      size: 45,
      meta: { columnName: "Id", columnType: "number" },
    },
    {
      id: "name",
      accessorKey: "name",
      header: undefined,
      size: 200,
      meta: { columnName: "Name", columnType: "text" },
    },
    {
      id: "description",
      accessorKey: "description",
      header: undefined,
      size: 300,
      meta: { columnName: "Description", columnType: "text" },
    },
    {
      id: "is_active",
      accessorKey: "is_active",
      header: undefined,
      size: 65,
      meta: { columnName: "Active", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.is_active} />,
    },
    createBufferColumn<Category>(),
  ];
}
