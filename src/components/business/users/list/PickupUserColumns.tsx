import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/UserStore";
import type { Profile } from "@/types/User";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRightIcon } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

export const PickupUserColumns = (
  setOpen: Dispatch<SetStateAction<boolean>>,
): ColumnDef<Profile>[] => [
  {
    id: "select",

    cell: ({ row }) => {
      const user = row.original;
      const { setSelectedUser } = useUserStore();
      return (
        <Button
          variant="outline"
          title="Select this user"
          onClick={() => {
            setSelectedUser(user);
            setOpen(false);
          }}
          aria-label="Select row"
        >
          <ChevronRightIcon />
        </Button>
      );
    },
    maxSize: 30,
    enableSorting: false,
    enableHiding: false,
  },
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
    id: "Role",
    accessorFn: (user) => user.role,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <span className="capitalize">{row.original.role}</span>,
    enableResizing: true,
  },
];
