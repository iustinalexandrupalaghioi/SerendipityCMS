import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { DataTableColumnvisibilityToggle } from "@/components/data-table/core/DataTableColumnVisibilityToggle";
import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { ImagePreview } from "@/components/partials/ImagePreview";
import { Button } from "@/components/ui/button";
import type { Course } from "@/types/Course";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { ChevronLeftIcon } from "lucide-react";

export const pickupCourseColumnVisibility: VisibilityState = {
  id: true,
  title: true,
  image_url: true,
  level: true,
  description: true,
  location: true,
  start_date: false,
  available_spots: false,
  remaining_spots: false,
  duration_days: true,
  is_open: false,
  price: false,
  advance_price: false,
  created_at: false,
};

export function createPickupCourseColumns(
  onSelect: (course: Course) => void,
): ColumnDef<Course>[] {
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
          title="Select this course"
          onClick={() => onSelect(row.original)}
        >
          <ChevronLeftIcon />
        </Button>
      ),
      meta: { className: "p-0" },
    },
    {
      id: "id",
      header: undefined,
      accessorKey: "id",
      meta: {
        columnName: "Id",
        columnType: "text",
      },
      size: 45,
    },
    {
      id: "title",
      header: undefined,
      accessorKey: "title",
      meta: {
        columnName: "Title",
        columnType: "text",
      },
      size: 250,
    },
    {
      id: "image_url",
      accessorKey: "image_url",
      meta: {
        columnName: "Image",
      },
      header: undefined,
      cell: ({ row }) => (
        <ImagePreview
          src={row.original.image_url}
          alt={row.original.title}
          filename={row.original.image_path?.split("/").pop() ?? "image"}
        />
      ),
      enableSorting: false,
      size: 220,
    },
    {
      id: "level",
      header: undefined,
      accessorKey: "level",
      meta: {
        columnName: "Level",
        columnType: "select",
        selectOptions: ["beginner", "intermediate", "advanced"],
      },
      cell: ({ row }) => (
        <span className="capitalize">{row.original.level}</span>
      ),
      size: 95,
    },
    {
      id: "description",
      header: undefined,
      accessorKey: "description",
      meta: {
        columnName: "Description",
        columnType: "text",
      },
      size: 250,
    },
    {
      id: "location",
      header: undefined,
      accessorKey: "location",
      meta: {
        columnName: "Location",
        columnType: "text",
      },
      size: 175,
    },
    {
      id: "start_date",
      header: undefined,
      accessorKey: "start_date",
      meta: {
        columnName: "Start date",
        columnType: "date",
      },
      size: 95,
    },
    {
      id: "available_spots",
      header: undefined,
      accessorKey: "available_spots",
      meta: {
        columnName: "Available spots",
        columnType: "number",
      },
      size: 105,
    },
    {
      id: "remaining_spots",
      header: undefined,
      accessorKey: "remaining_spots",
      meta: {
        columnName: "Remaining spots",
        columnType: "number",
      },
      size: 110,
    },
    {
      id: "duration_days",
      header: undefined,
      accessorKey: "duration_days",
      meta: {
        columnName: "Duration (days)",
        columnType: "number",
      },
      size: 105,
    },
    {
      id: "is_open",
      accessorKey: "is_open",
      header: undefined,
      meta: {
        columnName: "Open",
        columnType: "boolean",
      },
      size: 55,
      cell: ({ row }) => <BooleanDisplay value={row.original.is_open} />,
    },
    {
      id: "price",
      accessorKey: "price",
      header: undefined,
      meta: {
        columnName: "Price (EUR)",
        columnType: "number",
      },
      size: 95,
    },
    {
      id: "advance_price",
      accessorKey: "advance_price",
      header: undefined,
      meta: {
        columnName: "Advance price (EUR)",
        columnType: "number",
      },
      size: 130,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: undefined,
      meta: {
        columnName: "Created at",
        columnType: "date",
      },
      size: 85,
    },
    createBufferColumn<Course>(),
  ];
}
