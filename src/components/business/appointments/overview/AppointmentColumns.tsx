import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import TypedCell from "@/components/data-table/core/TableCell";
import type { RowAction } from "@/components/data-table/core/types";
import { StripeLink } from "@/components/partials/StripeLink";
import {
  APPOINTMENT_STATUS_OPTIONS,
  type Appointment,
} from "@/types/Appointment";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";

// ─────────────────────────────────────────────
// Column visibility defaults
// ─────────────────────────────────────────────

export const appointmentColumnVisibility: VisibilityState = {
  display_id: true,
  status: true,
  title: true,
  date: true,
  start_time: true,
  duration: true,
  end_time: true,
  name: true,
  email: true,
  price: true,
  advance_payment: true,
  advance_payment_paid: true,
  notes: false,
  payment_intent_id: true,
  created_at: false,
  expires_at: false,
  starts_at: false,
  expired_at: false,
  accepted_at: false,
  declined_at: false,
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

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
      isDeleteEligible: (row) =>
        ["completed", "cancelled", "declined", "expired", "no_show"].includes(
          row.original.status,
        ),
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
      id: "status",
      accessorKey: "status",
      header: undefined,
      meta: {
        columnName: "Status",
        columnType: "select",
        selectOptions: APPOINTMENT_STATUS_OPTIONS,
      },
      cell: TypedCell("select", APPOINTMENT_STATUS_OPTIONS),
      size: 100,
    },

    {
      id: "title",
      accessorFn: (row) => row.service?.title,
      header: undefined,
      meta: { columnName: "Service", columnType: "text", origin: "service" },
      size: 350,
    },
    {
      id: "date",
      accessorKey: "date",
      header: undefined,
      meta: { columnName: "Date", columnType: "date" },
      cell: TypedCell("date"),
      size: 100,
    },
    {
      id: "start_time",
      accessorKey: "start_time",
      header: undefined,
      meta: { columnName: "Start time", columnType: "time" },
      size: 90,
      cell: TypedCell("time"),
    },
    {
      id: "duration",
      accessorKey: "duration",
      header: undefined,
      meta: { columnName: "Duration", columnType: "number" },
      size: 90,
    },
    {
      id: "end_time",
      accessorKey: "end_time",
      header: undefined,
      meta: { columnName: "End time", columnType: "time" },
      size: 90,
      cell: TypedCell("time"),
    },
    {
      id: "name",
      accessorKey: "name",
      header: undefined,
      meta: {
        columnName: "Customer name",
        columnType: "text",
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: undefined,
      meta: { columnName: "Customer email", columnType: "text" },
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
      meta: { columnName: "Deposit (EUR)", columnType: "number" },
      size: 110,
    },
    {
      id: "advance_payment_paid",
      accessorKey: "advance_payment_paid",
      header: undefined,
      meta: { columnName: "Deposit paid", columnType: "boolean" },
      size: 100,
      cell: TypedCell("boolean"),
    },
    {
      id: "payment_intent_id",
      accessorKey: "payment_intent_id",
      header: undefined,
      meta: {
        columnName: "Stripe link",
        columnType: "text",
      },
      cell: ({ row }) => (
        <StripeLink paymentIntentId={row.original.payment_intent_id} />
      ),

      size: 120,
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      id: "notes",
      accessorKey: "notes",
      header: undefined,
      meta: { columnName: "Notes", columnType: "text" },
      size: 150,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: undefined,
      meta: { columnName: "Add time", columnType: "datetime" },
      cell: TypedCell("datetime"),
      size: 125,
    },
    {
      id: "starts_at",
      accessorKey: "starts_at",
      header: undefined,
      meta: { columnName: "Start time", columnType: "datetime" },
      cell: TypedCell("datetime"),
      size: 125,
    },
    {
      id: "expires_at",
      accessorKey: "expires_at",
      header: undefined,
      meta: { columnName: "Payment due", columnType: "datetime" },
      cell: TypedCell("datetime"),
      size: 125,
    },
    {
      id: "expired_at",
      accessorKey: "expired_at",
      header: undefined,
      meta: { columnName: "Expired time", columnType: "datetime" },
      cell: TypedCell("datetime"),
      size: 125,
    },
    {
      id: "accepted_at",
      accessorKey: "accepted_at",
      header: undefined,
      meta: { columnName: "Accepted time", columnType: "datetime" },
      cell: TypedCell("datetime"),
      size: 125,
    },
    {
      id: "declined_at",
      accessorKey: "declined_at",
      header: undefined,
      meta: { columnName: "Declined time", columnType: "datetime" },
      cell: TypedCell("datetime"),
      size: 125,
    },
    createBufferColumn<Appointment>(),
  ];
}
