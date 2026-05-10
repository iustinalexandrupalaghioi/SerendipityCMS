import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { ImagePreview } from "@/components/partials/ImagePreview";
import { COURSE_LEVEL_OPTIONS, type Course } from "@/types/Course";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";

// ─────────────────────────────────────────────
// Column visibility defaults
// ─────────────────────────────────────────────

export const courseColumnVisibility: VisibilityState = {
  display_id: true,
  title: true,
  image_url: true,
  display_order: true,
  level: true,
  description: true,
  location: false,
  duration_days: true,
  price: true,
  advance_price: true,
  is_open: true,
  available_spots: false,
  remaining_spots: false,
  created_at: false,
};

// ─────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────

export function createCourseColumns(
  onOpen: (rows: Row<Course>[]) => void,
  onDelete: (rows: Row<Course>[]) => void,
): ColumnDef<Course>[] {
  return [
    // ── [0] Selection ──
    createSelectionColumn<Course>(),

    // ── [1] Actions ──
    createActionsColumn<Course>({
      onOpen,
      onDelete,
      getRowUrl: (row) =>
        `${import.meta.env.VITE_ROOT_URL}/courses/update/${row.original.id}`,
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
      accessorKey: "title",
      meta: {
        columnName: "Title",
        columnType: "text",
      },
      size: 250,
    },
    {
      id: "image_url",
      accessorKey: "image_url",
      meta: {
        columnName: "Image",
      },
      header: undefined,
      cell: ({ row }) => (
        <ImagePreview
          src={row.original.image_url}
          alt={row.original.title}
          filename={row.original.image_path?.split("/").pop() ?? "image"}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 220,
    },
    {
      id: "level",
      header: undefined,
      accessorKey: "level",
      meta: {
        columnName: "Level",
        columnType: "select",
        selectOptions: COURSE_LEVEL_OPTIONS,
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.original.level}</span>
      ),
      size: 95,
    },
    {
      id: "description",
      header: undefined,
      accessorKey: "description",
      meta: {
        columnName: "Description",
        columnType: "text",
      },
      size: 250,
    },
    {
      id: "display_order",
      header: undefined,
      accessorKey: "display_order",
      meta: {
        columnName: "Order",
        columnType: "select",
        selectOptions: COURSE_LEVEL_OPTIONS,
      },

      size: 65,
    },
    {
      id: "location",
      header: undefined,
      accessorKey: "location",
      meta: {
        columnName: "Location",
        columnType: "text",
      },
      size: 175,
    },
    {
      id: "duration_days",
      header: undefined,
      accessorKey: "duration_days",
      meta: {
        columnName: "Duration (days)",
        columnType: "number",
      },
      size: 105,
    },
    {
      id: "price",
      accessorKey: "price",
      header: undefined,
      meta: {
        columnName: "Price (EUR)",
        columnType: "number",
      },
      size: 95,
    },
    {
      id: "advance_price",
      accessorKey: "advance_price",
      header: undefined,
      meta: {
        columnName: "Deposit (EUR)",
        columnType: "number",
      },
      size: 130,
    },
    {
      id: "available_spots",
      accessorKey: "available_spots",
      header: undefined,
      meta: {
        columnName: "Available spots",
        columnType: "number",
      },
      size: 130,
    },
    {
      id: "remaining_spots",
      accessorKey: "remaining_spots",
      header: undefined,
      meta: {
        columnName: "Remaining spots",
        columnType: "number",
      },
      size: 130,
    },
    {
      id: "is_open",
      accessorKey: "is_open",
      header: undefined,
      meta: {
        columnName: "Open",
        columnType: "number",
      },
      cell: ({ row }) => <BooleanDisplay value={row.original.is_open} />,
      size: 130,
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
    createBufferColumn<Course>(),
  ];
}
