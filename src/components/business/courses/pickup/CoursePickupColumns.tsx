import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { DataTableColumnvisibilityToggle } from "@/components/data-table/core/DataTableColumnVisibilityToggle";
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
  location: false,
  duration_days: true,
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
      id: "display_id",
      header: undefined,
      accessorKey: "display_id",
      meta: {
        columnName: "Id",
        columnType: "number",
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
