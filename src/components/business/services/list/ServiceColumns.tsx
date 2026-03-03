import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import type { Service } from "@/types/Service";
import type { ColumnDef } from "@tanstack/react-table";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { UpdateServiceDialog } from "../form/UpdateServiceDialog";

export const ServiceColumns: ColumnDef<Service>[] = [
  {
    id: "Image",
    accessorKey: "image_public_url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start py-1">
        <img
          src={row.original.image_public_url}
          alt={row.original.title}
          className="w-16 h-16 object-cover rounded-md shadow-sm"
        />
      </div>
    ),
    enableResizing: false,
  },
  {
    id: "Name",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Category",
    accessorKey: "category.name",
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
    id: "Duration (minutes)",
    accessorKey: "duration",
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
    id: "Popular",
    accessorKey: "is_popular",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.is_popular} />;
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
    id: "Active",
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
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
      const deleteService = async (id: string) => {
        const { data: service, error: serviceError } = await supabase
          .from("service")
          .select("image_path")
          .eq("id", id)
          .single();

        if (serviceError) {
          throw new Error("Failed to fetch service image");
        }

        // Step 2: if an image exists, delete from bucket
        if (service?.image_path) {
          const bucket = "services"; // your bucket name
          const { error: deleteErr } = await supabase.storage
            .from(bucket)
            .remove([service.image_path]);

          if (deleteErr) {
            console.error("Error deleting image:", deleteErr);
            throw new Error("Failed to delete service image");
          }
        }

        // Step 3: delete database record
        const { error: deleteServiceErr } = await supabase
          .from("service")
          .delete()
          .eq("id", id);

        if (deleteServiceErr) {
          throw new Error("Failed to delete service");
        }
      };
      const service = row.original;
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
              title="Delete Service Category"
              confirmationMessage={
                <>
                  Are you sure you want to delete the service{" "}
                  <span className="font-semibold">{service.title}</span>
                  ? <br /> This action cannot be undone.
                </>
              }
              id={service.id}
              queryKeys={[["services"]]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              target="service"
              deleteFn={() => deleteService(service.id)}
            />
          )}

          {isEditOpen && (
            <UpdateServiceDialog
              open={isEditOpen}
              setOpen={setEditOpen}
              service={service}
            />
          )}
        </div>
      );
    },
  },
];
