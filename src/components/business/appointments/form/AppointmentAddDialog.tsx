import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import AddDialog from "@/components/partials/dialog/AddDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";

import AppointmentForm from "./AppointmentForm";
import { AppointmentSchema, type AppointmentFormValues } from "./form-schema";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

export function AppointmentAddDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      service: undefined,
      user: undefined,
      name: "",
      email: "",
      date: format(new Date(), "yyyy-MM-dd"), // yyyy-MM-dd
      start_time: "",
      duration: 0,
      price: 0,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const addAppointmentMutation = useMutation({
    mutationFn: async (values: AppointmentFormValues) => {
      // Compute end_time
      const [hours, minutes] = values.start_time.split(":").map(Number);
      const [year, month, day] = values.date.split("-").map(Number);

      const endDate = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes + values.duration,
      );

      const endTime = endDate.toTimeString().slice(0, 5); // "HH:MM"

      const { error } = await supabase.from("appointment").insert([
        {
          service_id: values.service.id,
          user_id: values.user?.id || null,
          name: values.name,
          email: values.email,
          date: values.date,
          start_time: values.start_time,
          duration: values.duration,
          price: values.price,
          end_time: endTime,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Appointment booked successfully!");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["appointments"] });
      queryClient.refetchQueries({
        queryKey: ["appointments_count", "pending"],
      });

      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to book appointment.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    addAppointmentMutation.mutate(values);
  });

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Add Appointment"
      description="Fill the form below to book a new appointment."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto">
            <AppointmentForm
              setValue={form.setValue}
              control={form.control}
              errors={form.formState.errors}
              watch={form.watch}
              mode="Add"
            />
          </Card>

          <div className="flex flex-col md:flex-row-reverse gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !form.formState.isDirty || addAppointmentMutation.isPending
              }
            >
              {addAppointmentMutation.isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
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
