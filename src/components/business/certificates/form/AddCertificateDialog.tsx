import AddDialog from "@/components/partials/dialog/AddDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CertificateForm from "./CertificateForm";
import { CertificateSchema, type CertificateFormValues } from "./form-schema";
import { Card } from "@/components/ui/card";

const AddCertificateDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(CertificateSchema),
    defaultValues: {
      title: "",
      issuing_authority: "",
      is_featured: false,
      image: undefined,
    },
  });

  const { control, handleSubmit, formState, reset } = form;

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const addCertificateMutation = useMutation({
    mutationFn: async (values: CertificateFormValues) => {
      if (!values.image) {
        throw new Error("Certificate image is required. Please upload one.");
      }

      const bucket = "certificates";
      const folderName = `${Date.now()}`;
      const filePath = `${folderName}/${values.image.name}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, values.image, {
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Insert new certificate record
      const { error: insertError } = await supabase.from("certificate").insert([
        {
          title: values.title,
          issuing_authority: values.issuing_authority,
          is_featured: values.is_featured,
          image_path: filePath,
        },
      ]);

      if (insertError) throw new Error(insertError.message);
    },

    onSuccess: () => {
      toast.success("Certificate added successfully!");
      queryClient.refetchQueries({ queryKey: ["certificates"] });
      reset();
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add certificate.");
    },
  });

  const onSubmit = handleSubmit((values) =>
    addCertificateMutation.mutate(values),
  );

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Add Certificate"
      description="Fill in the details to add a new certificate."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
            <CertificateForm
              mode="Add"
              control={control}
              errors={formState.errors}
            />
          </Card>

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!formState.isDirty || addCertificateMutation.isPending}
            >
              {addCertificateMutation.isPending ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Adding...
                </>
              ) : (
                "Add"
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
    </AddDialog>
  );
};

export default AddCertificateDialog;
