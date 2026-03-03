import AddDialog from "@/components/partials/dialog/AddDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import type { Category } from "@/types/Category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ServiceForm from "./ServiceForm";
import { ServiceSchema, type ServiceFormValues } from "./form-schema";
import { Card } from "@/components/ui/card";

const AddServiceDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      advance_price: 0,
      fill_price: 0,
      advance_fill_price: 0,
      duration: 0,
      category: {} as Category,
      is_active: true,
      is_popular: false,
    },
  });

  const { control, setValue, handleSubmit, formState, reset } = form;

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const addServiceMutation = useMutation({
    mutationFn: async (values: ServiceFormValues) => {
      if (!values.image) {
        throw new Error(
          "The service image is mandatory. Please upload a file.",
        );
      }

      const bucket = "services";

      if (!values.image) {
        throw new Error(
          "The service image is mandatory. Please upload a file.",
        );
      }

      // create a folder using the current timestamp
      const folderName = `${Date.now()}`;
      const filePath = `${folderName}/${values.image.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, values.image, {
          upsert: false, // safe, won't overwrite existing files
        });

      if (uploadError) throw uploadError;

      // insert into your table
      const { data, error } = await supabase.from("service").insert([
        {
          title: values.title,
          description: values.description,
          duration: Number(values.duration),
          price: Number(values.price),
          advance_price: Number(values.price / 2),
          fill_price: Number(values.fill_price),
          advance_fill_price: Number(values.fill_price / 2),
          is_active: values.is_active,
          is_popular: values.is_popular,
          category_id: values.category?.id,
          image_path: filePath,
        },
      ]);

      if (error) throw new Error(error.message);

      return data;
    },

    onSuccess: () => {
      toast.success("Service added successfully!");
      queryClient.refetchQueries({ queryKey: ["services"] });
      reset();
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add service.");
    },
  });

  const onSubmit = handleSubmit((values) => addServiceMutation.mutate(values));

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Add Service"
      description="Fill in the details to create a new service."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
            <ServiceForm
              mode="Add"
              control={control}
              errors={formState.errors}
              setValue={setValue}
            />
          </Card>

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!formState.isDirty || addServiceMutation.isPending}
            >
              {addServiceMutation.isPending ? (
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

export default AddServiceDialog;
