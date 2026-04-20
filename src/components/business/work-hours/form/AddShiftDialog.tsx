import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import AddDialog from "@/components/partials/dialog/AddDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2Icon } from "lucide-react";
import ShiftForm from "../form/ShiftForm";
import { shiftSchema, type ShiftFormValues } from "../form/form-schema";

interface AddShiftDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export function AddShiftDialog({ open, setOpen }: AddShiftDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      day_start_time: "",
      day_end_time: "",
      interval: 15,
      is_active: true,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);
  const addShiftMutation = useMutation({
    mutationFn: async (values: ShiftFormValues) => {
      const { data, error } = await supabase.from("shift").insert([
        {
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
        },
      ]);

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: () => {
      toast.success("Business hours added successfully!");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["shifts"] });
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add business hours.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    addShiftMutation.mutate(values);
  });

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Business hours"
      description="Create a new business hours entry"
      showTrigger={false}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <ShiftForm control={form.control} mode="Add" />
          </div>
          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!form.formState.isDirty || addShiftMutation.isPending}
            >
              {addShiftMutation.isPending ? (
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
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </AddDialog>
  );
}
