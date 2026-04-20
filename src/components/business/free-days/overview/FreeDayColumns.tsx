import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import type { FreeDay } from "@/types/FreeDay";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";
import { format } from "date-fns";

// ─────────────────────────────────────────────
// Column visibility defaults
// ─────────────────────────────────────────────

export const freeDayColumnVisibility: VisibilityState = {
  id: true,
  date_from: true,
  date_until: true,
  created_at: false,
};

// ─────────────────────────────────────────────
// Columns
// ─────────────────────────────────────────────

export function createFreeDayColumns(
  onOpen: (rows: Row<FreeDay>[]) => void,
  onDelete: (rows: Row<FreeDay>[]) => void,
): ColumnDef<FreeDay>[] {
  return [
    // ── Selection ──
    createSelectionColumn<FreeDay>(),

    // ── Actions ──
    createActionsColumn<FreeDay>({
      onOpen,
      onDelete,
    }),

    // ── Data ──
    {
      id: "id",
      accessorKey: "id",
      header: undefined,

      meta: {
        columnName: "Id",
        columnType: "text",
      },
      size: 60,
    },
    {
      id: "date_from",
      accessorKey: "date_from",
      header: undefined,
      cell: ({ row }) => {
        return <span>{format(row.original.date_from, "dd-MM-yyyy")}</span>;
      },
      meta: {
        columnName: "From",
        columnType: "date",
      },
      size: 120,
    },
    {
      id: "date_until",
      accessorKey: "date_until",
      header: undefined,
      cell: ({ row }) => {
        return <span>{format(row.original.date_until, "dd-MM-yyyy")}</span>;
      },
      meta: {
        columnName: "Until",
        columnType: "date",
      },
      size: 120,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: undefined,
      meta: {
        columnName: "Created at",
        columnType: "date",
      },
      size: 140,
    },
    createBufferColumn<FreeDay>(),
  ];
}
