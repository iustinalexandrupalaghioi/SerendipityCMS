import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import { Button } from "@/components/ui/button";
import useCategoryStore from "@/stores/CategoryStore";
import type { Category } from "@/types/Category";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRightIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export const PickupCategoryColumns = (
  setOpen: Dispatch<SetStateAction<boolean>>,
): ColumnDef<Category>[] => [
  {
    id: "select",

    cell: ({ row }) => {
      const category = row.original;
      const { setSelectedCategory } = useCategoryStore();
      return (
        <Button
          variant="outline"
          title="Select this category"
          onClick={() => {
            setSelectedCategory(category);
            setOpen(false);
          }}
          aria-label="Select row"
        >
          <ChevronRightIcon />
        </Button>
      );
    },

    enableResizing: true,
  },

  {
    id: "Name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),

    enableResizing: true,
  },

  {
    id: "Description",
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),

    enableResizing: true,
  },
  {
    id: "Active",
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.is_active} />;
    },

    enableResizing: true,
  },
];
