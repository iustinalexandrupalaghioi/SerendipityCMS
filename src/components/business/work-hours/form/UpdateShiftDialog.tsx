import { useEffect, type Dispatch, type SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import ShiftForm from "../form/ShiftForm";
import { shiftSchema, type ShiftFormValues } from "../form/form-schema";
import type { Shift } from "@/types/Shift";
import { Loader2Icon } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface UpdateShiftDialogProps {
  shift: Shift;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateShiftDialog({
  shift,
  open,
  setOpen,
}: UpdateShiftDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      id: shift.id,
      day_start_time: formatTime(shift.day_start_time),
      day_end_time: formatTime(shift.day_end_time),
      interval: shift.interval,
      is_active: shift.is_active,
      monday: shift.monday,
      tuesday: shift.tuesday,
      wednesday: shift.wednesday,
      thursday: shift.thursday,
      friday: shift.friday,
      saturday: shift.saturday,
      sunday: shift.sunday,
    },
  });

  // Reset form when opening the dialog OR when shift changes
  useEffect(() => {
    if (open) {
      form.reset({
        id: shift.id,
        day_start_time: formatTime(shift.day_start_time),
        day_end_time: formatTime(shift.day_end_time),
        interval: shift.interval,
        is_active: shift.is_active,
        monday: shift.monday,
        tuesday: shift.tuesday,
        wednesday: shift.wednesday,
        thursday: shift.thursday,
        friday: shift.friday,
        saturday: shift.saturday,
        sunday: shift.sunday,
      });
    }
  }, [open, shift]);

  const updateShiftMutation = useMutation({
    mutationFn: async (values: ShiftFormValues) => {
      const { data, error } = await supabase
        .from("shift")
        .update({
          day_start_time: values.day_start_time,
          day_end_time: values.day_end_time,
          interval: values.interval,
          is_active: values.is_active,
          monday: values.monday,
          tuesday: values.tuesday,
          wednesday: values.wednesday,
          thursday: values.thursday,
          friday: values.friday,
          saturday: values.saturday,
          sunday: values.sunday,
        })
        .eq("id", shift.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: () => {
      toast.success("Shift updated successfully!");
      queryClient.refetchQueries({ queryKey: ["shifts"] });
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to update shift.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateShiftMutation.mutate(values);
  });

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title="Update Shift"
      description="Modify the selected shift."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
            <ShiftForm control={form.control} mode="Update" />
          </Card>

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !form.formState.isDirty || updateShiftMutation.isPending
              }
            >
              {updateShiftMutation.isPending ? (
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
