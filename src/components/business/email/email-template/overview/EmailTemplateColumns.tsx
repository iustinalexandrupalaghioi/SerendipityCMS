import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import TypedCell from "@/components/data-table/core/TableCell";
import type { RowAction } from "@/components/data-table/core/types";
import { EMAIL_TYPES_OPTIONS, type EmailTemplate } from "@/types/Email";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";

export const emailTemplateColumnVisibility: VisibilityState = {
  display_id: true,
  email_type: true,
  id: true,
  created_at: false,
};

export function createEmailTemplateColumns(
  onOpen: (rows: Row<EmailTemplate>[]) => void,
  onDelete: (rows: Row<EmailTemplate>[]) => void,
  actions: RowAction<EmailTemplate>[] = [],
): ColumnDef<EmailTemplate>[] {
  return [
    createSelectionColumn<EmailTemplate>(),
    createActionsColumn<EmailTemplate>({
      onOpen,
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
      id: "email_type",
      accessorKey: "email_type",
      header: undefined,
      meta: {
        columnName: "Email type",
        columnType: "select",
        selectOptions: EMAIL_TYPES_OPTIONS,
      },
      cell: TypedCell("select", EMAIL_TYPES_OPTIONS),
      size: 250,
    },
    {
      id: "id",
      accessorKey: "id",
      header: undefined,
      meta: { columnName: "Template id", columnType: "text" },
      size: 250,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: undefined,
      meta: { columnName: "Add time", columnType: "datetime" },
      cell: TypedCell("datetime"),
      size: 125,
    },
    createBufferColumn<EmailTemplate>(),
  ];
}
