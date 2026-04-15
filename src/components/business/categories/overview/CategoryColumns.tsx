import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import type { Category } from "@/types/Category";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";

// ─────────────────────────────────────────────
// Column visibility defaults
// ─────────────────────────────────────────────

export const categoryColumnVisibility: VisibilityState = {
  id: true,
  name: true,
  description: true,
  is_active: true,
  created_at: false,
};

// ─────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────

export function createCategoryColumns(
  onOpen: (rows: Row<Category>[]) => void,
  onDelete: (rows: Row<Category>[]) => void,
): ColumnDef<Category>[] {
  return [
    // ── [0] Selection ──
    createSelectionColumn<Category>(),

    // ── [1] Actions ──
    createActionsColumn<Category>({
      onOpen,
      onDelete,
    }),

    // ── Data columns ──
    {
      id: "id",
      accessorKey: "id",
      header: undefined,
      meta: {
        columnName: "Id",
        columnType: "text",
      },
      size: 45,
    },
    {
      id: "name",
      accessorKey: "name",
      header: undefined,
      meta: {
        columnName: "Name",
        columnType: "text",
      },
      size: 200,
    },
    {
      id: "description",
      accessorKey: "description",
      header: undefined,
      meta: {
        columnName: "Description",
        columnType: "text",
      },
      size: 300,
    },
    {
      id: "is_active",
      accessorKey: "is_active",
      header: undefined,
      meta: {
        columnName: "Active",
        columnType: "boolean",
      },
      size: 65,
      cell: ({ row }) => <BooleanDisplay value={row.original.is_active} />,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: undefined,
      meta: {
        columnName: "Created at",
        columnType: "date",
      },
      size: 85,
    },
  ];
}
