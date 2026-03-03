import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/User";
import { type ColumnDef } from "@tanstack/react-table";
import { PenIcon } from "lucide-react";
import { useState } from "react";
import { UpdateUserProfileDialog } from "../form/UpdateUserProfileDialog";
import { format } from "date-fns";

export const UserColumns: ColumnDef<Profile>[] = [
  {
    id: "Name",
    accessorFn: (user) => `${user.first_name} ${user.last_name}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableResizing: true,
  },
  {
    id: "Email",
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    enableResizing: true,
  },
  {
    id: "Date of birth",
    accessorFn: (user) => user.date_of_birth,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of birth" />
    ),
    cell: ({ row }) => (
      <span>{format(row.original.date_of_birth, "dd-MM-yyyy")}</span>
    ),
    enableResizing: true,
  },
  {
    id: "Role",
    accessorFn: (user) => user.role,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <span className="capitalize">{row.original.role}</span>,
    enableResizing: true,
  },
  {
    id: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const [isEditOpen, setEditOpen] = useState<boolean>(false);
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

          {isEditOpen && (
            <UpdateUserProfileDialog
              userProfile={row.original}
              open={isEditOpen}
              setOpen={setEditOpen}
            />
          )}
        </div>
      );
    },
    enableResizing: false,
  },
];
