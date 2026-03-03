import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import { Button } from "@/components/ui/button";
import useCourseStore from "@/stores/CourseStore";
import type { Course } from "@/types/Course";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRightIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export const PickupCourseColumns = (
  setOpen: Dispatch<SetStateAction<boolean>>,
): ColumnDef<Course>[] => [
  {
    id: "select",

    cell: ({ row }) => {
      const course = row.original;
      const { setselectedCourse } = useCourseStore();
      return (
        <Button
          variant="outline"
          title="Select this course"
          onClick={() => {
            setselectedCourse(course);
            setOpen(false);
          }}
          aria-label="Select row"
        >
          <ChevronRightIcon />
        </Button>
      );
    },
    size: 75,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Image",
    accessorKey: "image_url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start py-1">
        <img
          src={row.original.image_url}
          alt={row.original.title}
          className="w-16 h-16 object-cover rounded-md shadow-sm"
        />
      </div>
    ),
    enableResizing: true,
    size: 100,
  },
  {
    id: "Title",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),

    enableResizing: true,
  },

  {
    id: "Description",
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Duration (days)",
    accessorKey: "duration_days",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Open",
    accessorKey: "is_open",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => <BooleanDisplay value={row.original.is_open} />,
    enableResizing: true,
  },
  {
    id: "Price (EUR)",
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Advance price (EUR)",
    accessorKey: "advance_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
];
