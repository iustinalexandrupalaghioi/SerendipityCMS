import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Enrollment } from "@/types/Course";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { UpdateCourseEnrollmentDialog } from "../form/UpdateCourseEnrollmentDialog";

export const CourseEnrollmentColumns: ColumnDef<Enrollment>[] = [
  {
    id: "Customer",
    accessorFn: (row) =>
      `${row.profile?.first_name ?? ""} ${row.profile?.last_name ?? ""}`.trim(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    id: "Email address",
    accessorFn: (row) => `${row.profile?.email ?? ""}`.trim(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email address" />
    ),
  },
  {
    id: "Status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      const statusVariantMap: Record<
        string,
        "default" | "secondary" | "destructive" | "outline"
      > = {
        confirmed: "secondary",
        submitted: "outline",
        cancelled: "destructive",
      };

      return (
        <Badge
          className="capitalize font-medium"
          variant={statusVariantMap[status]}
        >
          {status}
        </Badge>
      );
    },
  },

  {
    id: "Enrollment date",
    accessorKey: "enrollment_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrolled on" />
    ),
    cell: ({ row }) =>
      row.original.enrollment_date
        ? format(new Date(row.original.enrollment_date), "yyyy-MM-dd")
        : "—",
  },
  {
    id: "Course",
    accessorFn: (row) => row.course?.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.course?.title ?? ""}</span>
    ),
  },

  {
    id: "Course date",
    accessorKey: "course_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course date" />
    ),
    cell: ({ row }) =>
      row.original.course_date
        ? format(new Date(row.original.course_date), "yyyy-MM-dd")
        : "—",
  },

  {
    id: "Price (EUR)",
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price (EUR)" />
    ),
  },

  {
    id: "Advance price",
    accessorKey: "advance_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Advance (EUR)" />
    ),
  },

  {
    id: "Advance paid",
    accessorKey: "advance_paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Advance paid" />
    ),
    cell: ({ row }) => <BooleanDisplay value={row.original.advance_paid} />,
  },

  {
    id: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const [isEditOpen, setEditOpen] = useState(false);
      const enrollment = row.original;
      return (
        <div className="flex gap-2">
          <Button
            size="icon"
            onClick={() => setEditOpen(true)}
            variant="outline"
            title="Edit"
          >
            <PenIcon />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            title="Delete enrollment"
            onClick={() => setOpen(true)}
          >
            <TrashIcon />
          </Button>

          {open && (
            <DeleteDialog
              title="Delete enrollment"
              confirmationMessage={
                <>
                  You're about to delete the course enrollment for{" "}
                  {row.original.profile?.first_name}{" "}
                  {row.original.profile?.last_name}.
                  <br /> Once deleted, the data cannot be recovered.
                </>
              }
              id={row.original.id}
              queryKeys={[["course_enrollments"]]}
              open={open}
              setOpen={setOpen}
              target="course_enrollment"
            />
          )}

          {isEditOpen && (
            <UpdateCourseEnrollmentDialog
              enrollment={enrollment}
              open={isEditOpen}
              setOpen={setEditOpen}
            />
          )}
        </div>
      );
    },
  },
];
