import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { ImagePreview } from "@/components/partials/ImagePreview";
import type { Service } from "@/types/Service";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";

// ─────────────────────────────────────────────
// Visibility
// ─────────────────────────────────────────────

export const serviceColumnVisibility: VisibilityState = {
  image_public_url: true,
  title: true,
  "category.name": true,
  description: true,
  duration: true,
  price: true,
  is_popular: true,
  is_active: true,
  created_at: false,
};

// ─────────────────────────────────────────────
// Columns
// ─────────────────────────────────────────────

export function createServiceColumns(
  onOpen: (rows: Row<Service>[]) => void,
  onDelete: (rows: Row<Service>[]) => void,
): ColumnDef<Service>[] {
  return [
    // ── Selection ──
    createSelectionColumn<Service>(),

    // ── Actions ──
    createActionsColumn<Service>({ onOpen, onDelete }),

    {
      id: "id",
      accessorKey: "id",
      header: undefined,
      meta: { columnName: "Id", columnType: "text" },
      size: 45,
    },
    // ── Name ──
    {
      id: "title",
      accessorKey: "title",
      header: undefined,
      meta: { columnName: "Name", columnType: "text" },
      size: 350,
    },
    // ── Category ──
    {
      id: "category",
      accessorKey: "category.name",
      header: undefined,
      meta: { columnName: "Category", columnType: "text" },
      size: 150,

      enableColumnFilter: false,
      enableSorting: false,
    },
    // ── Description ──
    {
      id: "description",
      accessorKey: "description",
      header: undefined,
      meta: { columnName: "Description", columnType: "text" },
      size: 350,
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

    // ── Duration ──
    {
      id: "duration",
      accessorKey: "duration",
      header: undefined,
      size: 130,
      meta: { columnName: "Duration (min)", columnType: "number" },
    },

    // ── Price ──
    {
      id: "price",
      accessorKey: "price",
      header: undefined,
      size: 110,
      meta: { columnName: "Price (EUR)", columnType: "number" },
    },

    // ── Popular ──
    {
      id: "is_popular",
      accessorKey: "is_popular",
      header: undefined,
      size: 80,
      meta: { columnName: "Popular", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.is_popular} />,
    },

    // ── Active ──
    {
      id: "is_active",
      accessorKey: "is_active",
      header: undefined,
      size: 80,
      meta: { columnName: "Active", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.is_active} />,
    },
  ];
}
