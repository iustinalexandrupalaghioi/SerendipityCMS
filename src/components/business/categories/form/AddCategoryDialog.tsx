import AddDialog from "@/components/partials/dialog/AddDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CategoryForm from "../form/CategoryForm";
import { categorySchema, type CategoryFormValues } from "../form/form-schema";

interface AddCatecoryDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export function AddCategoryDialog({ open, setOpen }: AddCatecoryDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const addCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const { data, error } = await supabase.from("category").insert([
        {
          name: values.name,
          description: values.description,
          is_active: values.is_active,
        },
      ]);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Category added successfully!");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["categories"] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add category.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    addCategoryMutation.mutate(values);
  });

  return (
    <AddDialog
      showTrigger={false}
      open={open}
      setOpen={setOpen}
      title="Category"
      description="Create a new service category."
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
                !form.formState.isDirty || addCategoryMutation.isPending
              }
            >
              {addCategoryMutation.isPending ? (
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
}
