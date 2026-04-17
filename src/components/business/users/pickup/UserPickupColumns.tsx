import { DataTableColumnvisibilityToggle } from "@/components/data-table/core/DataTableColumnVisibilityToggle";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/User";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronLeftIcon } from "lucide-react";

export const pickupUserColumnVisibility: VisibilityState = {
  id: true,
  full_name: false,
  first_name: true,
  last_name: true,
  email: true,
  date_of_birth: false,
  role: true,
  created_at: false,
};

export function createPickupUserColumns(
  onSelect: (user: Profile) => void,
): ColumnDef<Profile>[] {
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
          title="Select this user"
          onClick={() => onSelect(row.original)}
        >
          <ChevronLeftIcon />
        </Button>
      ),
      meta: { className: "p-0" },
    },
    {
      id: "id",
      accessorKey: "id",
      header: undefined,
      meta: {
        columnName: "Id",
        columnType: "text",
      },
      size: 45,
    },

    {
      id: "first_name",
      accessorKey: "first_name",
      header: undefined,
      meta: {
        columnName: "First name",
        columnType: "text",
      },
      size: 180,
    },
    {
      id: "last_name",
      accessorKey: "last_name",
      header: undefined,
      meta: {
        columnName: "Last name",
        columnType: "text",
      },
      size: 180,
    },
    {
      id: "full_name",
      accessorFn: (user) => `${user.first_name} ${user.last_name}`,
      header: undefined,
      meta: {
        columnName: "Name",
        columnType: "text",
      },
      size: 180,
      enableColumnFilter: false,
      enableSorting: false,
    },

    // ── Email ──
    {
      id: "email",
      accessorKey: "email",
      header: undefined,
      meta: {
        columnName: "Email",
        columnType: "text",
      },
      size: 220,
    },

    // ── Date of birth ──
    {
      id: "date_of_birth",
      accessorKey: "date_of_birth",
      header: undefined,
      meta: {
        columnName: "Date of birth",
        columnType: "date",
      },
      size: 140,
      cell: ({ row }) => {
        const value = row.original.date_of_birth;
        if (!value) return null;

        return <span>{format(new Date(value), "dd-MM-yyyy")}</span>;
      },
    },

    // ── Role ──
    {
      id: "role",
      accessorKey: "role",
      header: undefined,
      meta: {
        columnName: "Role",
        columnType: "select",
      },
      size: 100,
      cell: ({ row }) => (
        <span className="capitalize">{row.original.role}</span>
      ),
    },
  ];
}
