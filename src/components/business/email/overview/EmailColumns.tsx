import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import TypedCell from "@/components/data-table/core/TableCell";
import type { RowAction } from "@/components/data-table/core/types";
import { EMAIL_TYPES_OPTIONS, type Email } from "@/types/Email";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";

export const emailColumnVisibility: VisibilityState = {
  display_id: true,
  type: true,
  to: true,
  bcc: false,
  sent: true,
  sent_at: true,
  error: true,
  error_message: true,
  appointment_id: true,
  course_enrollment_id: true,
  created_at: false,
};

export function createEmailColumns(
  onDelete: (rows: Row<Email>[]) => void,
  actions: RowAction<Email>[] = [],
): ColumnDef<Email>[] {
  return [
    createSelectionColumn<Email>(),
    createActionsColumn<Email>({
      onDelete,
      actions: () => actions,
    }),
    {
      id: "display_id",
      accessorKey: "display_id",
      header: undefined,
      meta: { columnName: "Id", columnType: "number" },
      size: 45,
    },
    {
      id: "type",
      accessorKey: "type",
      header: undefined,
      meta: {
        columnName: "Type",
        columnType: "select",
        selectOptions: EMAIL_TYPES_OPTIONS,
      },
      cell: TypedCell("select", EMAIL_TYPES_OPTIONS),
      size: 180,
    },
    {
      id: "to",
      accessorKey: "to",
      header: undefined,
      meta: { columnName: "To", columnType: "text" },
      size: 180,
    },
    {
      id: "bcc",
      accessorKey: "bcc",
      header: undefined,
      meta: { columnName: "BCC", columnType: "text" },
      size: 120,
    },
    {
      id: "body",
      accessorKey: "body",
      header: undefined,
      meta: { columnName: "Sent tokens", columnType: "text" },
      cell: ({ row }) => (
        <span
          title={JSON.stringify(row.original.body, null, 2)}
          className="text-sm whitespace-nowrap"
        >
          {JSON.stringify(row.original.body, null, 2)}
        </span>
      ),
      size: 300,
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      id: "sent",
      accessorKey: "sent",
      header: undefined,
      meta: { columnName: "Sent", columnType: "boolean" },
      cell: TypedCell("boolean"),
      size: 55,
    },
    {
      id: "sent_at",
      accessorKey: "sent_at",
      header: undefined,
      meta: { columnName: "Sent at", columnType: "datetime" },
      cell: TypedCell("datetime"),
      size: 125,
    },
    {
      id: "error",
      accessorKey: "error",
      header: undefined,
      meta: { columnName: "Error", columnType: "boolean" },
      cell: TypedCell("boolean"),
      size: 55,
    },
    {
      id: "error_message",
      accessorKey: "error_message",
      header: undefined,
      meta: { columnName: "Error message", columnType: "text" },
      size: 250,
    },
    {
      id: "appointment_display_id",
      accessorKey: "appointment_display_id",
      header: undefined,
      meta: { columnName: "Appointment id", columnType: "number" },
      size: 120,
    },
    {
      id: "enrollment_display_id",
      accessorKey: "enrollment_display_id",
      header: undefined,
      meta: { columnName: "Enrollment id", columnType: "number" },
      size: 120,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: undefined,
      meta: { columnName: "Created at", columnType: "datetime" },
      cell: TypedCell("datetime"),
      size: 125,
    },
    createBufferColumn<Email>(),
  ];
}
