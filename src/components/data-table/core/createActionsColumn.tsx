import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { ChevronRightIcon } from "lucide-react";
import { DataTableColumnvisibilityToggle } from "./DataTableColumnVisibilityToggle";
import type { RowAction } from "./types";

// ─────────────────────────────────────────────
// createActionsColumn
//
// Shared utility column used by every table.
// Always column [1] — after the selection column.
//
// Header: column visibility toggle
// Cell: chevron button that calls onOpen for the row
//
// onOpen, onDelete, and any other meta are wired
// at the overview level, not inside column definitions.
//
// Usage:
//   createActionsColumn<Course>({
//     onOpen: (rows) => navigate(`/courses/update/${rows[0].id}`),
//     onDelete: (rows) => deleteCourse(rows),
//   })
// ─────────────────────────────────────────────

interface ActionsColumnMeta<TData> {
  onOpen?: (rows: Row<TData>[]) => void;
  onDelete?: (rows: Row<TData>[]) => void;
  isDeleteEligible?: (row: Row<TData>) => boolean;
  getRowUrl?: (row: Row<TData>) => string;
  actions?: () => RowAction<TData>[];
}

export function createActionsColumn<TData>(
  meta: ActionsColumnMeta<TData> = {},
): ColumnDef<TData> {
  return {
    id: "columns",
    header: ({ table }) => <DataTableColumnvisibilityToggle table={table} />,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        className="w-fit"
        onClick={(e) => {
          e.stopPropagation();
          meta.onOpen?.([row]);
        }}
        aria-label="Open row"
      >
        <ChevronRightIcon />
      </Button>
    ),
    enableSorting: false,
    enableResizing: false,
    enableHiding: false,
    size: 40,
    minSize: 40,
    maxSize: 40,
    meta: {
      className: "p-0",
      ...meta,
    },
  };
}
