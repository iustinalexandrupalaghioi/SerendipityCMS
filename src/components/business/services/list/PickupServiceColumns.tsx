import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import { Button } from "@/components/ui/button";
import useServiceStore from "@/stores/ServiceStore";
import type { Service } from "@/types/Service";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRightIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export const PickupServiceColumns = (
  setOpen: Dispatch<SetStateAction<boolean>>,
): ColumnDef<Service>[] => [
  {
    id: "select",

    cell: ({ row }) => {
      const service = row.original;
      const { setSelectedService } = useServiceStore();
      return (
        <Button
          variant="outline"
          title="Select this service"
          onClick={() => {
            setSelectedService(service);
            setOpen(false);
          }}
          aria-label="Select row"
        >
          <ChevronRightIcon />
        </Button>
      );
    },
    maxSize: 100,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Image",
    accessorKey: "image_public_url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start py-1">
        <img
          src={row.original.image_public_url}
          alt={row.original.title}
          className="w-16 h-16 object-cover rounded-md shadow-sm"
        />
      </div>
    ),
    enableResizing: false,
    maxSize: 80,
    minSize: 80,
  },
  {
    id: "Name",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: "Category",
    accessorFn: (row) => row.category.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },

  {
    id: "Duration (minutes)",
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration (minutes)" />
    ),
  },
  {
    id: "Price (EUR)",
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    id: "Popular",
    accessorKey: "is_popular",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Popular" />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.is_popular} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<boolean>(columnId);
      if (filterValue === "true") return value === true;
      if (filterValue === "false") return value === false;
      return true;
    },
  },
];
