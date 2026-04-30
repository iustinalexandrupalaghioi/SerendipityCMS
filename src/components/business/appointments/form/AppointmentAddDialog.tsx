import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import AddDialog from "@/components/partials/dialog/AddDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";

import { addDays, format } from "date-fns";
import AppointmentForm from "./AppointmentForm";
import { AppointmentSchema, type AppointmentFormValues } from "./form-schema";

interface AppointmentAddDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export function AppointmentAddDialog({
  open,
  setOpen,
}: AppointmentAddDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      service: undefined,
      user: undefined,
      name: "",
      email: "",
      date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      start_time: "",
      duration: 0,
      price: 0,
      advance_payment: 0,
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

      const { error } = await supabase.functions.invoke("create-appointment", {
        body: {
          service_id: values.service.id,
          user_id: values.user?.id || null,
          name: values.name,
          email: values.email,
          date: values.date,
          start_time: values.start_time,
          duration: values.duration,
          price: values.price,
          advance_payment: values.advance_payment,
          end_time: endTime,
          action_type: "create_appointment",
          author: "admin",
        },
      });

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
    onError: async (error: any) => {
      const status = error?.context?.status;
      const body = await error?.context?.json().catch(() => null);
      const message = body?.error;

      if (status === 409) {
        toast.error(message ?? "An active appointment already exists.");
        return;
      }

      if (status === 400) {
        toast.error(message ?? "Invalid booking details.");
        return;
      }

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
      showTrigger={false}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <AppointmentForm
              setValue={form.setValue}
              control={form.control}
              errors={form.formState.errors}
              watch={form.watch}
              mode="Add"
            />
          </div>
          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
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
