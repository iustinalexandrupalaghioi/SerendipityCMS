import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/Category";
import type { ColumnDef } from "@tanstack/react-table";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { UpdateCategoryDialog } from "../form/UpdateCategoryDialog";

export const CategoryColumns: ColumnDef<Category>[] = [
  {
    id: "Name",
    accessorKey: "name",
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
    id: "Active",
    accessorKey: "isActive",
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
    id: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
      const [isEditOpen, setEditOpen] = useState<boolean>(false);
      const category = row.original;
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
              title="Delete Service Category"
              confirmationMessage={
                <>
                  You're about to delete the service category{" "}
                  <span className="font-semibold">"{category.name}"</span>.
                  <br /> Once deleted, this category and its associated data
                  cannot be recovered.
                </>
              }
              id={category.id}
              queryKeys={[["categories"]]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              target="category"
            />
          )}
          {isEditOpen && (
            <UpdateCategoryDialog
              open={isEditOpen}
              setOpen={setEditOpen}
              category={category}
            />
          )}
        </div>
      );
    },
  },
];
