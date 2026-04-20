import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import type { Category } from "@/types/Category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CategoryForm from "../form/CategoryForm";
import { categorySchema, type CategoryFormValues } from "../form/form-schema";

interface UpdateCategoryDialogProps {
  category: Category;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateCategoryDialog({
  category,
  open,
  setOpen,
}: UpdateCategoryDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
    },
  });

  // Reset form values when dialog opens or category changes
  useEffect(() => {
    if (open) {
      form.reset({
        id: category.id,
        name: category.name,
        description: category.description,
        is_active: category.is_active,
      });
    }
  }, [open, category]);

  const updateCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const { data, error } = await supabase
        .from("category")
        .update({
          name: values.name,
          description: values.description,
          is_active: values.is_active,
        })
        .eq("id", category.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success(
        `Category "${form.getValues().name}" updated successfully!`,
      );
      queryClient.refetchQueries({ queryKey: ["categories"] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update category.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateCategoryMutation.mutate(values);
  });

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title={category.name}
      description="Update the existing service category below."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <CategoryForm
              control={form.control}
              errors={form.formState.errors}
              mode="Add"
            />
          </div>
          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !form.formState.isDirty || updateCategoryMutation.isPending
              }
            >
              {updateCategoryMutation.isPending ? (
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
