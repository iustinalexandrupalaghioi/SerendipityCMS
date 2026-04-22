import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { DataTableColumnvisibilityToggle } from "@/components/data-table/core/DataTableColumnVisibilityToggle";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { ImagePreview } from "@/components/partials/ImagePreview";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/Service";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { ChevronLeftIcon } from "lucide-react";

export const pickupServiceColumnVisibility: VisibilityState = {
  id: true,
  title: true,
  description: true,
  image_public_url: true,
  "category.name": true,
  duration: true,
  price: true,
  is_popular: true,
};

export function createPickupServiceColumns(
  onSelect: (service: Service) => void,
): ColumnDef<Service>[] {
  return [
    // ── Select button ──
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
          title="Select this service"
          onClick={() => onSelect(row.original)}
        >
          <ChevronLeftIcon />
        </Button>
      ),
      meta: {
        className: "p-0",
      },
    },
    {
      id: "id",
      accessorKey: "id",
      header: undefined,
      size: 45,
      meta: { columnName: "Id", columnType: "text" },
    },

    // ── Name ──
    {
      id: "title",
      accessorKey: "title",
      header: undefined,
      meta: { columnName: "Name", columnType: "text" },
      size: 400,
    },

    {
      id: "description",
      accessorKey: "description",
      header: undefined,
      meta: { columnName: "Description", columnType: "text" },
      size: 150,
    },

    // ── Image ──
    {
      id: "image_public_url",
      accessorKey: "image_public_url",
      header: undefined,
      size: 120,
      enableSorting: false,
      meta: { columnName: "Image", columnType: "text" },
      cell: ({ row }) => (
        <ImagePreview
          src={row.original.image_public_url}
          alt={row.original.title}
          filename={row.original.image_path?.split("/").pop() ?? "image"}
        />
      ),
    },

    // ── Category ──
    {
      id: "name",
      accessorFn: (row) => row.category?.name,
      header: undefined,
      meta: { columnName: "Category", columnType: "text", origin: "category" },
      size: 150,
      enableColumnFilter: false,
    },

    // ── Duration ──
    {
      id: "duration",
      accessorKey: "duration",
      header: undefined,
      size: 110,
      meta: { columnName: "Duration (min)", columnType: "number" },
    },

    // ── Price ──
    {
      id: "price",
      accessorKey: "price",
      header: undefined,
      size: 100,
      meta: { columnName: "Price (EUR)", columnType: "number" },
    },

    // ── Popular ──
    {
      id: "is_popular",
      accessorKey: "is_popular",
      header: undefined,
      size: 75,
      meta: { columnName: "Popular", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.is_popular} />,
    },
    createBufferColumn<Service>(),
  ];
}
