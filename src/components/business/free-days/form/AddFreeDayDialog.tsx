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
import { freeDaySchema, type FreeDayFormValues } from "./form-schema";
import FreeDayForm from "./FreeDayForm";

interface AddFreeDayDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export function AddFreeDayDialog({ open, setOpen }: AddFreeDayDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<FreeDayFormValues>({
    resolver: zodResolver(freeDaySchema),
    defaultValues: {
      date_from: "",
      date_until: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const addCategoryMutation = useMutation({
    mutationFn: async (values: FreeDayFormValues) => {
      const { data, error } = await supabase.from("free_day").insert([
        {
          date_from: values.date_from,
          date_until: values.date_until,
        },
      ]);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Free days added successfully!");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["free_days"] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add free days.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    addCategoryMutation.mutate(values);
  });

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Free days"
      description="Create a new free days entry."
      showTrigger={false}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <FreeDayForm
            control={form.control}
            errors={form.formState.errors}
            mode="Add"
          />

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
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
