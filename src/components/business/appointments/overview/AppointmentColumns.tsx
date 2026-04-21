import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { Badge } from "@/components/ui/badge";
import type { RowAction } from "@/components/data-table/core/types";
import type { Appointment } from "@/types/Appointment";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";

// ─────────────────────────────────────────────
// Column visibility defaults
// ─────────────────────────────────────────────

export const appointmentColumnVisibility: VisibilityState = {
  status: true,
  service: true,
  date: true,
  start_time: true,
  end_time: true,
  name: true,
  email: true,
  price: true,
  advance_payment: false,
  advance_payment_paid: false,
  notes: false,
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const statusVariantMap: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  confirmed: "secondary",
  approved: "secondary",
  pending: "outline",
  canceled: "destructive",
  rejected: "destructive",
  completed: "default",
};

// ─────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────

export function createAppointmentColumns(
  onOpen: (rows: Row<Appointment>[]) => void,
  onDelete: (rows: Row<Appointment>[]) => void,
  actions: RowAction<Appointment>[] = [],
): ColumnDef<Appointment>[] {
  return [
    createSelectionColumn<Appointment>(),
    createActionsColumn<Appointment>({
      onOpen,
      onDelete,
      actions: () => actions,
    }),
    {
      id: "id",
      accessorKey: "id",
      header: undefined,
      meta: { columnName: "Id", columnType: "text" },
      size: 45,
    },
    {
      id: "status",
      accessorKey: "status",
      header: undefined,
      meta: {
        columnName: "Status",
        columnType: "select",
        selectOptions: [
          "pending",
          "approved",
          "confirmed",
          "completed",
          "rejected",
          "canceled",
        ],
      },
      cell: ({ row }) => (
        <Badge
          className="capitalize font-medium"
          variant={statusVariantMap[row.original.status]}
        >
          {row.original.status}
        </Badge>
      ),
      size: 100,
    },

    {
      id: "service",
      accessorKey: "service.title",
      header: undefined,
      meta: { columnName: "Service", columnType: "text" },
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      id: "date",
      accessorKey: "date",
      header: undefined,
      meta: { columnName: "Date", columnType: "date" },
      size: 100,
    },
    {
      id: "start_time",
      accessorKey: "start_time",
      header: undefined,
      meta: { columnName: "Start time", columnType: "text" },
      size: 90,
      cell: ({ row }) => <span>{row.original.start_time.slice(0, 5)}</span>,
    },
    {
      id: "end_time",
      accessorKey: "end_time",
      header: undefined,
      meta: { columnName: "End time", columnType: "text" },
      size: 90,
      cell: ({ row }) => <span>{row.original.end_time.slice(0, 5)}</span>,
    },
    {
      id: "name",
      accessorFn: (row) =>
        row.profile?.first_name + " " + row.profile?.last_name,
      header: undefined,
      meta: { columnName: "Customer name", columnType: "text" },
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      id: "email",
      accessorKey: "email",
      header: undefined,
      meta: { columnName: "Customer email", columnType: "text" },
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      id: "price",
      accessorKey: "price",
      header: undefined,
      meta: { columnName: "Price (EUR)", columnType: "number" },
      size: 100,
    },
    {
      id: "advance_payment",
      accessorKey: "advance_payment",
      header: undefined,
      meta: { columnName: "Advance payment (EUR)", columnType: "number" },
      size: 130,
    },
    {
      id: "advance_payment_paid",
      accessorKey: "advance_payment_paid",
      header: undefined,
      meta: { columnName: "Deposit paid", columnType: "boolean" },
      size: 90,
      cell: ({ row }) => (
        <BooleanDisplay value={row.original.advance_payment_paid} />
      ),
    },
    {
      id: "notes",
      accessorKey: "notes",
      header: undefined,
      meta: { columnName: "Notes", columnType: "text" },
      size: 150,
    },
    createBufferColumn<Appointment>(),
  ];
}
