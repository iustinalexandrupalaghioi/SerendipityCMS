import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import type { FreeDay } from "@/types/FreeDay";
import type { ColumnDef } from "@tanstack/react-table";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { UpdateFreeDayDialog } from "../form/UpdateFreeDaydialog";

export const FreeDayColumns: ColumnDef<FreeDay>[] = [
  {
    id: "From",
    accessorKey: "date_from",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },

  {
    id: "Until",
    accessorKey: "date_until",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
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
      const freeDay = row.original;
      return (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            title="Edit"
            onClick={() => setEditOpen(true)}
          >
            <PenIcon />
          </Button>

          <Button
            size="icon"
            variant="destructive"
            title="Delete"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
          </Button>

          {isDeleteOpen && (
            <DeleteDialog
              title="Delete Free Day"
              confirmationMessage={
                <>
                  You're about to delete the free day from{" "}
                  <span className="font-semibold">"{freeDay.date_from}"</span>{" "}
                  until{" "}
                  <span className="font-semibold">"{freeDay.date_until}"</span>.
                  <br /> Once deleted, the data cannot be recovered.
                </>
              }
              id={freeDay.id}
              queryKeys={[["free_days"]]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              target="free_day"
            />
          )}
          {isEditOpen && (
            <UpdateFreeDayDialog
              freeDay={freeDay}
              open={isEditOpen}
              setOpen={setEditOpen}
            />
          )}
        </div>
      );
    },
  },
];
