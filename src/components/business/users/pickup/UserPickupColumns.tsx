import { createBufferColumn } from "@/components/data-table/core/createBufferColumn";
import { DataTableColumnvisibilityToggle } from "@/components/data-table/core/DataTableColumnVisibilityToggle";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/User";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronLeftIcon } from "lucide-react";

export const pickupUserColumnVisibility: VisibilityState = {
  id: true,
  full_name: true,
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
      id: "display_id",
      accessorKey: "display_id",
      header: undefined,
      meta: {
        columnName: "Id",
        columnType: "number",
      },
      size: 45,
    },
    {
      id: "full_name",
      accessorKey: "full_name",
      header: undefined,
      meta: {
        columnName: "Full name",
        columnType: "text",
      },
      size: 180,
    },

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
    createBufferColumn<Profile>(),
  ];
}
