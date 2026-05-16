import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import TypedCell from "@/components/data-table/core/TableCell";
import type { RowAction } from "@/components/data-table/core/types";
import { StripeLink } from "@/components/partials/StripeLink";
import {
  ENROLLMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  type Enrollment,
} from "@/types/Course";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";

export const courseEnrollmentColumnVisibility: VisibilityState = {
  display_id: true,
  title: true,
  full_name: true,
  email: true,
  status: true,
  enrollment_date: true,
  start_date: true,
  price: true,
  advance_price: true,
  payment_type: true,
  advance_payment_paid: true,
  payment_intent_id: true,
  notes: false,
  created_at: false,
  expired_at: false,
  declined_at: false,
};

export function createCourseEnrollmentColumns(
  onOpen: (rows: Row<Enrollment>[]) => void,
  onDelete: (rows: Row<Enrollment>[]) => void,
  actions: RowAction<Enrollment>[] = [],
): ColumnDef<Enrollment>[] {
  return [
    createSelectionColumn<Enrollment>(),
    createActionsColumn<Enrollment>({
      onOpen,
      onDelete,
      isDeleteEligible: (row) =>
        ["completed", "cancelled", "declined", "no_show", "expired"].includes(
          row.original.status,
        ),
      actions: () => actions,
    }),
    {
      id: "display_id",
      accessorKey: "display_id",
      header: undefined,
      meta: {
        columnName: "Id",
        columnType: "number",
      },
      size: 45,
    },
    {
      id: "title",
      accessorFn: (row) => row.course_session?.course?.title,
      header: undefined,
      meta: {
        columnName: "Course",
        columnType: "text",
        origin: "course_session.course",
      },
      enableSorting: false,
      size: 200,
    },
    {
      id: "full_name",
      accessorFn: (row) => row.profile?.full_name,
      header: undefined,
      meta: { columnName: "Customer", columnType: "text", origin: "profile" },
      size: 200,
    },
    {
      id: "email",
      accessorFn: (row) => row.profile?.email ?? "",
      header: undefined,
      meta: {
        columnName: "Email address",
        columnType: "text",
        origin: "profile",
      },
      size: 200,
    },
    {
      id: "status",
      accessorKey: "status",
      header: undefined,
      meta: {
        columnName: "Status",
        columnType: "select",
        selectOptions: ENROLLMENT_STATUS_OPTIONS,
      },
      cell: TypedCell("select", ENROLLMENT_STATUS_OPTIONS),
      size: 110,
    },
    {
      id: "enrollment_date",
      accessorKey: "enrollment_date",
      header: undefined,
      meta: { columnName: "Enrolled on", columnType: "date" },
      cell: TypedCell("date"),
      size: 90,
    },
    {
      id: "payment_type",
      accessorKey: "payment_type",
      header: undefined,
      meta: {
        columnName: "Payment type",
        columnType: "select",
        selectOptions: PAYMENT_TYPE_OPTIONS,
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.original.payment_type}</span>
      ),
      size: 110,
    },

    {
      id: "price",
      accessorKey: "price",
      header: undefined,
      meta: {
        columnName: "Price (EUR)",
        columnType: "number",
      },
      size: 90,
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
      id: "advance_payment_paid",
      accessorKey: "advance_payment_paid",
      header: undefined,
      meta: { columnName: "Deposit paid", columnType: "boolean" },
      cell: TypedCell("boolean"),
    },
    {
      id: "payment_intent_id",
      accessorKey: "payment_intent_id",
      header: undefined,
      meta: {
        columnName: "Stripe link",
        columnType: "number",
      },
      cell: ({ row }) => (
        <StripeLink paymentIntentId={row.original.payment_intent_id} />
      ),
      size: 120,
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
      id: "expired_at",
      accessorKey: "expired_at",
      header: undefined,
      meta: { columnName: "Expired time", columnType: "datetime" },
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
    createBufferColumn<Enrollment>(),
  ];
}
