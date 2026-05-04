import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import type { RowAction } from "@/components/data-table/core/types";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import type { CourseSession } from "@/types/Course";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";
import { format } from "date-fns/format";

// ─────────────────────────────────────────────
// Column visibility defaults
// ─────────────────────────────────────────────

export const courseSessionColumnVisibility: VisibilityState = {
  id: true,
  title: false,
  start_date: true,
  price: true,
  advance_price: true,
  available_spots: true,
  remaining_spots: true,
  is_open: true,
  created_at: false,
};

// ─────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────

export function createCourseSessionColumns(
  onOpen: (rows: Row<CourseSession>[]) => void,
  onDelete: (rows: Row<CourseSession>[]) => void,
  actions: RowAction<CourseSession>[] = [],
): ColumnDef<CourseSession>[] {
  return [
    // ── [0] Selection ──
    createSelectionColumn<CourseSession>(),

    // ── [1] Actions ──
    createActionsColumn<CourseSession>({
      onOpen,
      onDelete,
      getRowUrl: (row) =>
        `${import.meta.env.VITE_ROOT_URL}/courses/sessions/update/${row.original.id}`,
      actions: () => actions,
    }),

    // ── Data columns ──
    {
      id: "display_id",
      header: undefined,
      accessorKey: "display_id",
      meta: {
        columnName: "Id",
        columnType: "number",
      },
      size: 45,
    },
    {
      id: "title",
      header: undefined,
      accessorFn: (row) => row.course?.title,
      meta: {
        columnName: "Course name",
        columnType: "text",
        origin: "course",
      },
      size: 150,
    },
    {
      id: "start_date",
      header: undefined,
      accessorKey: "start_date",
      cell: ({ row }) =>
        row.original.start_date
          ? format(new Date(row.original.start_date), "dd-MM-yyyy")
          : "—",
      meta: {
        columnName: "Start date",
        columnType: "date",
      },
      size: 110,
    },
    {
      id: "price",
      header: undefined,
      accessorKey: "price",
      meta: {
        columnName: "Price (EUR)",
        columnType: "number",
      },
      size: 110,
    },
    {
      id: "advance_price",
      header: undefined,
      accessorKey: "advance_price",
      meta: {
        columnName: "Advance price (EUR)",
        columnType: "number",
      },
      size: 145,
    },
    {
      id: "available_spots",
      header: undefined,
      accessorKey: "available_spots",
      meta: {
        columnName: "Available spots",
        columnType: "number",
      },
      size: 120,
    },
    {
      id: "remaining_spots",
      header: undefined,
      accessorKey: "remaining_spots",
      meta: {
        columnName: "Remaining spots",
        columnType: "number",
      },
      size: 125,
    },
    {
      id: "is_open",
      header: undefined,
      accessorKey: "is_open",
      meta: {
        columnName: "Open",
        columnType: "boolean",
      },
      size: 55,
      cell: ({ row }) => <BooleanDisplay value={row.original.is_open} />,
    },
    {
      id: "created_at",
      header: undefined,
      accessorKey: "created_at",
      meta: {
        columnName: "Created at",
        columnType: "date",
      },
      size: 85,
    },
    createBufferColumn<CourseSession>(),
  ];
}
