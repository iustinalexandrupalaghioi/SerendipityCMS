import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { formatTime } from "@/lib/utils";
import type { Shift } from "@/types/Shift";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";

// ─────────────────────────────────────────────
// Visibility
// ─────────────────────────────────────────────

export const shiftColumnVisibility: VisibilityState = {
  id: true,
  day_start_time: true,
  day_end_time: true,
  is_active: true,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  sunday: true,
  created_at: false,
};

// ─────────────────────────────────────────────
// Columns
// ─────────────────────────────────────────────

export function createShiftColumns(
  onOpen: (rows: Row<Shift>[]) => void,
  onDelete: (rows: Row<Shift>[]) => void,
): ColumnDef<Shift>[] {
  return [
    // ── Selection ──
    createSelectionColumn<Shift>(),

    // ── Actions ──
    createActionsColumn<Shift>({
      onOpen,
      onDelete,
    }),

    // ── Start time ──
    {
      id: "day_start_time",
      accessorKey: "day_start_time",
      header: undefined,
      size: 85,
      meta: {
        columnName: "Start time",
        columnType: "text",
      },
      cell: ({ row }) => <span>{formatTime(row.original.day_start_time)}</span>,
    },

    // ── End time ──
    {
      id: "day_end_time",
      accessorKey: "day_end_time",
      header: undefined,
      size: 85,
      meta: {
        columnName: "End time",
        columnType: "text",
      },
      cell: ({ row }) => <span>{formatTime(row.original.day_end_time)}</span>,
    },

    // ── Active ──
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

    // ── Weekdays (boolean fields) ──
    {
      id: "monday",
      accessorKey: "monday",
      header: undefined,
      size: 80,
      meta: { columnName: "Monday", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.monday} />,
    },
    {
      id: "tuesday",
      accessorKey: "tuesday",
      header: undefined,
      size: 80,
      meta: { columnName: "Tuesday", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.tuesday} />,
    },
    {
      id: "wednesday",
      accessorKey: "wednesday",
      header: undefined,
      size: 90,
      meta: { columnName: "Wednesday", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.wednesday} />,
    },
    {
      id: "thursday",
      accessorKey: "thursday",
      header: undefined,
      size: 80,
      meta: { columnName: "Thursday", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.thursday} />,
    },
    {
      id: "friday",
      accessorKey: "friday",
      header: undefined,
      size: 80,
      meta: { columnName: "Friday", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.friday} />,
    },
    {
      id: "saturday",
      accessorKey: "saturday",
      header: undefined,
      size: 80,
      meta: { columnName: "Saturday", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.saturday} />,
    },
    {
      id: "sunday",
      accessorKey: "sunday",
      header: undefined,
      size: 80,
      meta: { columnName: "Sunday", columnType: "boolean" },
      cell: ({ row }) => <BooleanDisplay value={row.original.sunday} />,
    },
    createBufferColumn<Shift>(),
  ];
}
