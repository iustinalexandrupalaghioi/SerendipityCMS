import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import CertificateForm from "./CertificateForm";
import { CertificateSchema, type CertificateFormValues } from "./form-schema";

import type { Certificate } from "@/types/Certificate";
import { Card } from "@/components/ui/card";

interface UpdateCertificateDialogProps {
  certificate: Certificate;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const UpdateCertificateDialog = ({
  certificate,
  open,
  setOpen,
}: UpdateCertificateDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(CertificateSchema),
    defaultValues: {
      id: certificate.id,
      title: certificate.title,
      issuing_authority: certificate.issuing_authority,
      is_featured: certificate.is_featured,
      image: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        id: certificate.id,
        title: certificate.title,
        issuing_authority: certificate.issuing_authority,
        is_featured: certificate.is_featured,
        image: undefined,
      });
    }
  }, [open, certificate]);

  const updateCertificateMutation = useMutation({
    mutationFn: async (values: CertificateFormValues) => {
      const bucket = "certificates";
      let imagePath = certificate.image_path;

      if (values.image) {
        // Remove previous image if exists
        if (imagePath) {
          const { error: deleteErr } = await supabase.storage
            .from(bucket)
            .remove([imagePath]);
          if (deleteErr) console.warn("Failed to delete old image:", deleteErr);
        }

        // Create a unique folder using the current timestamp
        const folderName = `${Date.now()}`;
        const newPath = `${folderName}/${values.image.name}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(newPath, values.image, { upsert: false });
        if (uploadError) throw uploadError;

        imagePath = newPath;
      }

      // Update certificate row
      const { error: updateError } = await supabase
        .from("certificate")
        .update({
          title: values.title,
          issuing_authority: values.issuing_authority,
          is_featured: values.is_featured,
          image_path: imagePath,
        })
        .eq("id", certificate.id);

      if (updateError) throw new Error(updateError.message);
    },

    onSuccess: () => {
      toast.success(
        `Certificate "${form.getValues().title}" updated successfully!`,
      );
      queryClient.refetchQueries({ queryKey: ["certificates"] });
      queryClient.refetchQueries({ queryKey: ["featured-certificates"] });
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to update certificate.");
    },
  });

  const onSubmit = form.handleSubmit((values) =>
    updateCertificateMutation.mutate(values),
  );

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title={certificate.title}
      description="Update the details of the certificate below."
      className="md:max-w-4xl"
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
            <CertificateForm
              mode="Update"
              control={form.control}
              errors={form.formState.errors}
              existingImageUrl={certificate.image_public_url}
            />
          </Card>

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !form.formState.isDirty || updateCertificateMutation.isPending
              }
            >
              {updateCertificateMutation.isPending ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </UpdateDialog>
  );
};

export default UpdateCertificateDialog;
