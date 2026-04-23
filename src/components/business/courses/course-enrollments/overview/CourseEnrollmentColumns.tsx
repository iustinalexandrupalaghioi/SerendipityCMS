import { createActionsColumn } from "@/components/data-table/core/createActionsColumn";
import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { createSelectionColumn } from "@/components/data-table/core/createSelectionColumn";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { Badge } from "@/components/ui/badge";
import type { Enrollment } from "@/types/Course";
import type { ColumnDef, Row, VisibilityState } from "@tanstack/react-table";
import { format } from "date-fns";

export const courseEnrollmentColumnVisibility: VisibilityState = {
  id: true,
  title: true,
  full_name: true,
  email: true,
  status: true,
  enrollment_date: true,
  course_date: true,
  price: true,
  advance_price: true,
  advance_payment_paid: true,
};

const statusVariantMap: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  confirmed: "secondary",
  submitted: "outline",
  cancelled: "destructive",
};

export function createCourseEnrollmentColumns(
  onOpen: (rows: Row<Enrollment>[]) => void,
  onDelete: (rows: Row<Enrollment>[]) => void,
): ColumnDef<Enrollment>[] {
  return [
    createSelectionColumn<Enrollment>(),
    createActionsColumn<Enrollment>({ onOpen, onDelete }),
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
      id: "title",
      accessorFn: (row) => row.course?.title,
      header: undefined,
      meta: {
        columnName: "Course",
        columnType: "text",
        origin: "course",
      },
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
        selectOptions: ["submitted", "confirmed", "cancelled", "completed"],
      },
      cell: ({ row }) => (
        <Badge
          className="capitalize font-medium"
          variant={statusVariantMap[row.original.status]}
        >
          {row.original.status}
        </Badge>
      ),
      size: 110,
    },
    {
      id: "enrollment_date",
      accessorKey: "enrollment_date",
      header: undefined,
      meta: { columnName: "Enrolled on", columnType: "date" },
      cell: ({ row }) =>
        row.original.enrollment_date
          ? format(new Date(row.original.enrollment_date), "dd-MM-yyyy")
          : "—",
      size: 90,
    },
    {
      id: "course_date",
      accessorKey: "course_date",
      header: undefined,
      meta: { columnName: "Course date", columnType: "date" },
      cell: ({ row }) =>
        row.original.course_date
          ? format(new Date(row.original.course_date), "dd-MM-yyyy")
          : "—",
      size: 90,
    },
    {
      id: "price",
      accessorKey: "price",
      header: undefined,
      meta: { columnName: "Price (EUR)", columnType: "number" },
      size: 90,
    },
    {
      id: "advance_price",
      accessorKey: "advance_price",
      header: undefined,
      meta: { columnName: "Advance price (EUR)", columnType: "number" },
      size: 130,
    },
    {
      id: "advance_payment_paid",
      accessorKey: "advance_payment_paid",
      header: undefined,
      meta: { columnName: "Deposit paid", columnType: "boolean" },
      cell: ({ row }) => (
        <BooleanDisplay value={row.original.advance_payment_paid} />
      ),
    },
    createBufferColumn<Enrollment>(),
  ];
}
