import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import type { Certificate } from "@/types/Certificate";

import type { ColumnDef } from "@tanstack/react-table";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import UpdateCertificateDialog from "../form/UpdateCertificateDialog";
import { supabase } from "@/lib/supabaseClient";

export const CertificateColumns: ColumnDef<Certificate>[] = [
  {
    id: "Name",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    id: "Issuing authority",
    accessorKey: "issuing_authority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    id: "On home page",
    accessorKey: "isFeatured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <BooleanDisplay value={row.original.is_featured} />;
    },
  },
  {
    id: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
      const [isEditOpen, setEditOpen] = useState<boolean>(false);
      const deleteCertificate = async (id: string) => {
        // Step 1: Fetch certificate record to get image path
        const { data: certificate, error: fetchError } = await supabase
          .from("certificate")
          .select("image_path")
          .eq("id", id)
          .single();

        if (fetchError) {
          console.error("Error fetching certificate:", fetchError);
          throw new Error("Failed to fetch certificate image.");
        }

        // Step 2: Delete image from Supabase Storage if it exists
        if (certificate?.image_path) {
          const bucket = "certificates"; // your bucket name
          const { error: deleteImageError } = await supabase.storage
            .from(bucket)
            .remove([certificate.image_path]);

          if (deleteImageError) {
            console.error(
              "Error deleting certificate image:",
              deleteImageError,
            );
            throw new Error("Failed to delete certificate image.");
          }
        }

        // Step 3: Delete the certificate record from the database
        const { error: deleteCertificateError } = await supabase
          .from("certificate")
          .delete()
          .eq("id", id);

        if (deleteCertificateError) {
          console.error(
            "Error deleting certificate record:",
            deleteCertificateError,
          );
          throw new Error("Failed to delete certificate.");
        }
      };

      const certificate = row.original;
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
              title="Delete Certificate"
              confirmationMessage={
                <>
                  Are you sure you want to delete the certificate
                  <span className="font-semibold"> {certificate.title} </span>
                  ? <br /> This action cannot be undone.
                </>
              }
              id={certificate.id!}
              queryKeys={[["certificates"], ["featured-certificates"]]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              target="certificate"
              deleteFn={() => deleteCertificate(certificate.id)}
            />
          )}

          {isEditOpen && (
            <UpdateCertificateDialog
              certificate={certificate}
              open={isEditOpen}
              setOpen={setEditOpen}
            />
          )}
        </div>
      );
    },
  },
];
