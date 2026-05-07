import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { Badge } from "@/components/ui/badge";
import type { RowAction } from "@/components/data-table/core/types";
import type { Appointment } from "@/types/Appointment";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { format } from "date-fns";

// ─────────────────────────────────────────────
// Column visibility defaults
// ─────────────────────────────────────────────

export const appointmentColumnVisibility: VisibilityState = {
  display_id: true,
  status: true,
  title: true,
  date: true,
  start_time: true,
  end_time: true,
  name: true,
  email: true,
  price: true,
  advance_payment: true,
  advance_payment_paid: true,
  notes: false,
  payment_intent_id: true,
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const statusVariantMap: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  confirmed: "secondary",
  accepted: "secondary",
  pending: "outline",
  cancelled: "destructive",
  declined: "destructive",
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
      isDeleteEligible: (row) =>
        ["completed", "cancelled", "declined"].includes(row.original.status),
      actions: () => actions,
    }),
    {
      id: "display_id",
      accessorKey: "display_id",
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
          "accepted",
          "confirmed",
          "completed",
          "declined",
          "cancelled",
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
      cell: ({ row }) =>
        row.original.date
          ? format(new Date(row.original.date), "dd-MM-yyyy")
          : "—",
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
      cell: ({ row }) => (
        <BooleanDisplay value={row.original.advance_payment_paid} />
      ),
    },
    {
      id: "payment_intent_id",
      accessorKey: "payment_intent_id",
      header: undefined,
      meta: {
        columnName: "Stripe link",
        columnType: "number",
      },
      cell: ({ row }) => {
        const intentId = row.original.payment_intent_id;
        if (!intentId) return <span className="text-muted-foreground">—</span>;

        const account = import.meta.env.VITE_STRIPE_ACCOUNT_ID;

        const uri = import.meta.env.PROD
          ? `https://dashboard.stripe.com/${account}/payments/`
          : `https://dashboard.stripe.com/${account}/test/payments/`;
        return (
          <a
            href={uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            View in Stripe
          </a>
        );
      },
      size: 120,
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
