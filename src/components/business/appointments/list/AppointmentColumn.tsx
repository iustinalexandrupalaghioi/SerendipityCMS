import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Appointment } from "@/types/Appointment";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import {
  EllipsisVertical,
  SquareArrowOutUpRight,
  SquarePen,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import ApproveAppointmentAction from "../actions/ApproveAppointmentAction";
import RejectAppointmentDialog from "../actions/reject/RejectAppointmentDialog";
import UpdateAndApproveDialog from "../actions/update-and-approve/UpdateAndApproveDialog";
import AppointmentUpdateDialog from "../form/AppointmentUpdateDialog";
import CompleteAppointmentAction from "../actions/CompleteAppointmentAction";

export const AppoitmentsColumns: ColumnDef<Appointment>[] = [
  {
    id: "Status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      const statusVariantMap: Record<
        string,
        "default" | "secondary" | "destructive" | "outline"
      > = {
        confirmed: "secondary",
        approved: "secondary",
        pending: "outline",
        canceled: "destructive",
        rejected: "destructive",
        completed: "default",
      };

      return (
        <Badge
          className="capitalize font-medium"
          variant={statusVariantMap[status]}
        >
          {status}
        </Badge>
      );
    },
    enableResizing: true,
  },
  {
    id: "Service",
    accessorKey: "service.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Date",
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Start time",
    accessorKey: "start_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => <span>{row.original.start_time.slice(0, 5)}</span>,
    enableResizing: true,
  },
  {
    id: "End time",
    accessorKey: "end_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => <span>{row.original.end_time.slice(0, 5)}</span>,
    enableResizing: true,
  },
  {
    id: "Customer name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Customer email",
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
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
    id: "Advance payment (EUR)",
    accessorKey: "advance_payment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Advance paid",
    accessorKey: "advance_payment_paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.advance_payment_paid} />;
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
    id: "Notes",
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
    size: 150,
  },
  {
    id: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    meta: {
      className: "sticky right-0 bg-card pe-0 z-20",
    },
    enableResizing: true,
    cell: ({ row }) => {
      const appointment = row.original;
      const [isEditOpen, setEditOpen] = useState<boolean>(false);

      const [isUpdateAndApproveOpen, setUpdateAndApproveOpen] =
        useState<boolean>(false);
      const [isRejectOpen, setRejectOpen] = useState<boolean>(false);
      return (
        <div className="flex flex-wrap gap-2 z-10">
          <Button
            onClick={() => setEditOpen(true)}
            variant="outline"
            size="icon"
            title="View details"
          >
            <SquareArrowOutUpRight />
          </Button>

          {/* Actions Dropdown */}
          {["pending", "confirmed"].some(
            (status) => status === appointment.status,
          ) && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="More actions">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {appointment.status === "pending" && (
                  <>
                    <ApproveAppointmentAction id={appointment.id} />

                    <DropdownMenuItem
                      onClick={() => setUpdateAndApproveOpen(true)}
                    >
                      <SquarePen className="mr-2 h-4 w-4" />
                      Update & Approve
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive hover:text-destructive!"
                      onClick={() => setRejectOpen(true)}
                    >
                      <XIcon className="mr-2 h-4 w-4 text-destructive" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}

                {appointment.status === "confirmed" && (
                  <CompleteAppointmentAction id={appointment.id} />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isEditOpen && (
            <AppointmentUpdateDialog
              appointment={appointment}
              open={isEditOpen}
              setOpen={setEditOpen}
            />
          )}

          {isUpdateAndApproveOpen && (
            <UpdateAndApproveDialog
              appointment={appointment}
              setOpen={setUpdateAndApproveOpen}
              open={isUpdateAndApproveOpen}
            />
          )}

          {isRejectOpen && (
            <RejectAppointmentDialog
              appointment={appointment}
              setOpen={setRejectOpen}
              open={isRejectOpen}
            />
          )}
        </div>
      );
    },
  },
];
