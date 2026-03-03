import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import type { FreeDay } from "@/types/FreeDay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { freeDaySchema, type FreeDayFormValues } from "./form-schema";
import FreeDayForm from "./FreeDayForm";
import { Card } from "@/components/ui/card";

interface UpdateFreeDayDialogProps {
  freeDay: FreeDay;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateFreeDayDialog({
  freeDay,
  open,
  setOpen,
}: UpdateFreeDayDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<FreeDayFormValues>({
    resolver: zodResolver(freeDaySchema),
    defaultValues: {
      id: freeDay.id,
      date_from: freeDay.date_from,
      date_until: freeDay.date_until,
    },
  });

  // Reset form values when dialog opens or FreeDay changes
  useEffect(() => {
    if (open) {
      form.reset({
        id: freeDay.id,
        date_from: freeDay.date_from,
        date_until: freeDay.date_until,
      });
    }
  }, [open, freeDay]);

  const updateFreeDayMutation = useMutation({
    mutationFn: async (values: FreeDayFormValues) => {
      const { data, error } = await supabase
        .from("free_day")
        .update({
          date_from: values.date_from,
          date_until: values.date_until,
        })
        .eq("id", freeDay.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success(
        `Free day entry from "${form.getValues().date_from}" until "${
          form.getValues().date_until
        }" updated successfully!`,
      );
      queryClient.refetchQueries({ queryKey: ["free_days"] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update free days entry.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateFreeDayMutation.mutate(values);
  });

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title={freeDay.date_from + " to " + freeDay.date_until}
      description="Update the existing service FreeDay below."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
            <FreeDayForm
              control={form.control}
              errors={form.formState.errors}
              mode="Update"
            />
          </Card>

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !form.formState.isDirty || updateFreeDayMutation.isPending
              }
            >
              {updateFreeDayMutation.isPending ? (
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
