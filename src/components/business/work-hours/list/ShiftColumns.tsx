import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import type { Shift } from "@/types/Shift";
import type { ColumnDef } from "@tanstack/react-table";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { UpdateShiftDialog } from "../form/UpdateShiftDialog";

export const ShiftColumns: ColumnDef<Shift>[] = [
  {
    id: "Start time",
    accessorKey: "day_start_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <span>{formatTime(row.original.day_start_time)}</span>;
    },
    enableResizing: true,
  },
  {
    id: "End time",
    accessorKey: "day_end_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <span>{formatTime(row.original.day_end_time)}</span>;
    },
    enableResizing: true,
  },
  {
    id: "Active",
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.is_active} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<boolean>(columnId);
      if (filterValue === "true") return value === true;
      if (filterValue === "false") return value === false;
      return true;
    },
    enableResizing: true,
  },
  {
    id: "Monday",
    accessorKey: "monday",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.monday} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<boolean>(columnId);
      if (filterValue === "true") return value === true;
      if (filterValue === "false") return value === false;
      return true;
    },
    enableResizing: true,
  },
  {
    id: "Tuesday",
    accessorKey: "tuesday",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.tuesday} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<boolean>(columnId);
      if (filterValue === "true") return value === true;
      if (filterValue === "false") return value === false;
      return true;
    },
    enableResizing: true,
  },
  {
    id: "Wednesday",
    accessorKey: "wednesday",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.wednesday} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<boolean>(columnId);
      if (filterValue === "true") return value === true;
      if (filterValue === "false") return value === false;
      return true;
    },
    enableResizing: true,
  },
  {
    id: "Thursday",
    accessorKey: "thursday",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.thursday} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<boolean>(columnId);
      if (filterValue === "true") return value === true;
      if (filterValue === "false") return value === false;
      return true;
    },
    enableResizing: true,
  },
  {
    id: "Friday",
    accessorKey: "friday",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.friday} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<boolean>(columnId);
      if (filterValue === "true") return value === true;
      if (filterValue === "false") return value === false;
      return true;
    },
    enableResizing: true,
  },
  {
    id: "Saturday",
    accessorKey: "saturday",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.saturday} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<boolean>(columnId);
      if (filterValue === "true") return value === true;
      if (filterValue === "false") return value === false;
      return true;
    },
    enableResizing: true,
  },
  {
    id: "Sunday",
    accessorKey: "sunday",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.sunday} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<boolean>(columnId);
      if (filterValue === "true") return value === true;
      if (filterValue === "false") return value === false;
      return true;
    },
    enableResizing: true,
  },

  {
    id: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
      const [isEditOpen, setEditOpen] = useState<boolean>(false);
      const shift = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            title="Edit"
            onClick={() => setEditOpen(true)}
          >
            <PenIcon />
          </Button>

          <Button
            variant="destructive"
            title="Delete"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
          </Button>

          {isDeleteOpen && (
            <DeleteDialog
              title="Delete Shift"
              confirmationMessage={
                <>
                  You're about to delete the shift from{" "}
                  <span className="font-semibold">
                    "{shift.day_start_time}"
                  </span>{" "}
                  until{" "}
                  <span className="font-semibold">"{shift.day_end_time}"</span>
                  .
                  <br /> Once deleted, this shift and its associated data cannot
                  be recovered.
                </>
              }
              id={shift.id}
              queryKeys={[["shifts"]]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              target="shift"
            />
          )}
          {isEditOpen && (
            <UpdateShiftDialog
              shift={shift}
              open={isEditOpen}
              setOpen={setEditOpen}
            />
          )}
        </div>
      );
    },
  },
];
