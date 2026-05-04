import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { DataTableColumnvisibilityToggle } from "@/components/data-table/core/DataTableColumnVisibilityToggle";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { Button } from "@/components/ui/button";
import type { CourseSession } from "@/types/Course";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { format } from "date-fns/format";
import { ChevronLeftIcon } from "lucide-react";

export const pickupCourseSessionColumnVisibility: VisibilityState = {
  display_id: true,
  title: true,
  start_date: true,
  price: true,
  advance_price: false,
  available_spots: true,
  remaining_spots: true,
  is_open: true,
  created_at: false,
};

export function createPickupCourseSessionColumns(
  onSelect: (session: CourseSession) => void,
): ColumnDef<CourseSession>[] {
  return [
    {
      id: "select",
      size: 40,
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => <DataTableColumnvisibilityToggle table={table} />,
      cell: ({ row }) => (
        <Button
          className="w-fit"
          variant="ghost"
          title="Select this session"
          onClick={() => onSelect(row.original)}
        >
          <ChevronLeftIcon />
        </Button>
      ),
      meta: { className: "p-0" },
    },
    {
      id: "display_id",
      header: undefined,
      accessorKey: "display_id",
      meta: { columnName: "Id", columnType: "number" },
      size: 45,
    },
    {
      id: "title",
      header: undefined,
      accessorFn: (row) => row.course?.title,
      meta: { columnName: "Course name", columnType: "text", origin: "course" },
      size: 200,
    },
    {
      id: "start_date",
      header: undefined,
      accessorKey: "start_date",
      cell: ({ row }) =>
        row.original.start_date
          ? format(new Date(row.original.start_date), "dd-MM-yyyy")
          : "—",
      meta: { columnName: "Start date", columnType: "date" },
      size: 110,
    },
    {
      id: "price",
      header: undefined,
      accessorKey: "price",
      meta: { columnName: "Price (EUR)", columnType: "number" },
      size: 110,
    },
    {
      id: "advance_price",
      header: undefined,
      accessorKey: "advance_price",
      meta: { columnName: "Advance price (EUR)", columnType: "number" },
      size: 145,
    },
    {
      id: "available_spots",
      header: undefined,
      accessorKey: "available_spots",
      meta: { columnName: "Available spots", columnType: "number" },
      size: 120,
    },
    {
      id: "remaining_spots",
      header: undefined,
      accessorKey: "remaining_spots",
      meta: { columnName: "Remaining spots", columnType: "number" },
      size: 125,
    },
    {
      id: "is_open",
      header: undefined,
      accessorKey: "is_open",
      meta: { columnName: "Open", columnType: "boolean" },
      size: 55,
      cell: ({ row }) => <BooleanDisplay value={row.original.is_open} />,
    },
    {
      id: "created_at",
      header: undefined,
      accessorKey: "created_at",
      meta: { columnName: "Created at", columnType: "date" },
      size: 85,
    },
    createBufferColumn<CourseSession>(),
  ];
}
