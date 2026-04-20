import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import type { RowAction } from "@/components/data-table/core/types";
import type { CourseDayActivity } from "@/types/Course";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";

// ─────────────────────────────────────────────
// Column visibility defaults
// ─────────────────────────────────────────────

export const courseDayActivityColumnVisibility: VisibilityState = {
  id: true,
  activity: true,
};

// ─────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────

export function createCourseDayActivityColumns(
  onOpen: (rows: Row<CourseDayActivity>[]) => void,
  onDelete: (rows: Row<CourseDayActivity>[]) => void,
  actions: RowAction<CourseDayActivity>[] = [],
): ColumnDef<CourseDayActivity>[] {
  return [
    // ── [0] Selection ──
    createSelectionColumn<CourseDayActivity>(),

    // ── [1] Actions ──
    createActionsColumn<CourseDayActivity>({
      onOpen,
      onDelete,
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
      id: "activity",
      accessorKey: "activity",
      header: undefined,
      meta: {
        columnName: "Activity",
        columnType: "text",
      },
      size: 350,
    },
    createBufferColumn<CourseDayActivity>(),
  ];
}
