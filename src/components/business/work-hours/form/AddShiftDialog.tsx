import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import AddDialog from "@/components/partials/dialog/AddDialog";
import ShiftForm from "../form/ShiftForm";
import { shiftSchema, type ShiftFormValues } from "../form/form-schema";
import { Loader2Icon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AddShiftDialog() {
  const [open, setOpen] = useState(false);
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
      toast.success("Shift added successfully!");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["shifts"] });
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add shift.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    addShiftMutation.mutate(values);
  });

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Add Shift"
      description="Create a new employee shift."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
            <ShiftForm control={form.control} mode="Add" />{" "}
          </Card>

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
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
