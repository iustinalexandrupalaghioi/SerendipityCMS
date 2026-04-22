import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import { ImagePreview } from "@/components/partials/ImagePreview";
import type { RowAction } from "@/components/data-table/core/types";
import type { CourseDay } from "@/types/Course";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";

// ─────────────────────────────────────────────
// Column visibility defaults
// ─────────────────────────────────────────────

export const courseDayColumnVisibility: VisibilityState = {
  id: true,
  day_number: true,
  image_url: true,
  title: true,
  created_at: false,
};

// ─────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────

export function createCourseDayColumns(
  courseId: string,
  onOpen: (rows: Row<CourseDay>[]) => void,
  onDelete: (rows: Row<CourseDay>[]) => void,
  actions: RowAction<CourseDay>[] = [],
): ColumnDef<CourseDay>[] {
  return [
    // ── [0] Selection ──
    createSelectionColumn<CourseDay>(),

    // ── [1] Actions ──
    createActionsColumn<CourseDay>({
      onOpen,
      onDelete,
      getRowUrl: (row) =>
        `${import.meta.env.VITE_ROOT_URL}/courses/update/${courseId}/course-days/update/${row.original.id}`,
      actions: () => actions,
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
      id: "day_number",
      accessorKey: "day_number",
      header: undefined,
      meta: {
        columnName: "Day",
        columnType: "number",
      },
      size: 65,
    },
    {
      id: "title",
      accessorKey: "title",
      header: undefined,
      meta: {
        columnName: "Title",
        columnType: "text",
      },
      size: 250,
    },
    {
      id: "image_url",
      accessorKey: "image_url",
      header: undefined,
      meta: {
        columnName: "Image",
      },
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
      id: "created_at",
      accessorKey: "created_at",
      header: undefined,
      meta: {
        columnName: "Created at",
        columnType: "date",
      },
      size: 85,
    },
    createBufferColumn<CourseDay>(),
  ];
}
