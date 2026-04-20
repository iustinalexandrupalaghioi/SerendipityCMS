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

import ServiceForm from "../form/ServiceForm";
import { ServiceSchema, type ServiceFormValues } from "../form/form-schema";

import type { Service } from "@/types/Service";

interface UpdateServiceDialogProps {
  service: Service;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateServiceDialog({
  service,
  open,
  setOpen,
}: UpdateServiceDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      id: service.id,
      title: service.title,
      description: service.description,
      duration: service.duration,
      price: service.price,
      advance_price: service.advance_price,
      category: service.category,
      is_active: service.is_active,
      is_popular: service.is_popular,
      image: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        id: service.id,
        title: service.title,
        description: service.description,
        duration: service.duration,
        price: service.price,
        advance_price: service.advance_price,
        category: service.category,
        is_active: service.is_active,
        is_popular: service.is_popular,
        image: undefined,
      });
    }
  }, [open, service]);

  const updateServiceMutation = useMutation({
    mutationFn: async (values: ServiceFormValues) => {
      const bucket = "services";

      let imagePath = service.image_path;

      if (values.image) {
        // Remove previous image (if exists)
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
          .upload(newPath, values.image, { upsert: false }); // safer, won't overwrite
        if (uploadError) throw uploadError;

        imagePath = newPath;
      }

      const { data, error } = await supabase
        .from("service")
        .update({
          title: values.title,
          description: values.description,
          duration: Number(values.duration),
          price: Number(values.price),
          advance_price: Number(values.advance_price),
          is_active: values.is_active,
          is_popular: values.is_popular,
          category_id: values.category?.id,
          image_path: imagePath,
        })
        .eq("id", service.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: () => {
      toast.success(
        `Service "${form.getValues().title}" updated successfully!`,
      );
      queryClient.refetchQueries({ queryKey: ["services"] });
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to update service.");
    },
  });

  const onSubmit = form.handleSubmit((values) =>
    updateServiceMutation.mutate(values),
  );

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title={service.title}
      description="Update the details of the service below."
      className="md:max-w-lg"
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <ServiceForm
              mode="Update"
              control={form.control}
              errors={form.formState.errors}
              setValue={form.setValue}
              watch={form.watch}
              existingImageUrl={service.image_public_url}
            />
          </div>

          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !form.formState.isDirty || updateServiceMutation.isPending
              }
            >
              {updateServiceMutation.isPending ? (
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
}
