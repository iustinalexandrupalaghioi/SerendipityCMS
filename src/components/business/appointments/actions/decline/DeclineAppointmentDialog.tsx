import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";

import type { Appointment } from "@/types/Appointment";
import { DialogClose } from "@radix-ui/react-dialog";
import DeclineAppointmentForm from "./DeclineAppointmentForm";
import { AppointmentSchema, type AppointmentFormValues } from "./form-schema";

interface DeclineAppointmentDialogProps {
  appointment: Appointment;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeclineAppointmentDialog = ({
  appointment,
  open,
  setOpen,
}: DeclineAppointmentDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      id: appointment.id,
      name: appointment.name,
      email: appointment.email,
      duration: Number(appointment.duration) || undefined,
      price: Number(appointment.price) || undefined,
      notes: appointment.notes || "",
      advance_payment: Number(appointment.advance_payment) || undefined,
      service: appointment.service,
      date: appointment.date,
      start_time: appointment.start_time.slice(0, 5),
      end_time: appointment.end_time.slice(0, 5),
    },
  });

  /* Reset form when dialog closes */
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const updateAppointmentMutation = useMutation({
    mutationFn: async (values: AppointmentFormValues) => {
      const { error } = await supabase
        .from("appointment")
        .update({
          status: "declined",
          notes: values.notes,
        })
        .eq("id", values.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Appointment successfully declined!");
      await queryClient.refetchQueries({ queryKey: ["appointments"] });
      form.reset();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to decline appointment.");
    },
  });

  const onSubmit = form.handleSubmit(
    (values) => {
      updateAppointmentMutation.mutate(values);
    },
    (errors) => {
      console.error("Form errors:", errors);
    },
  );

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title="Decline appointment"
      description="Decline this appointment request. The customer will receive a notification about the decline."
      className="md:max-w-lg"
      disableUpdate
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <DeclineAppointmentForm
              control={form.control}
              errors={form.formState.errors}
            />
          </div>
          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
            <Button type="submit" className="flex-1">
              Decline
            </Button>

            <DialogClose asChild className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </UpdateDialog>
  );
};

export default DeclineAppointmentDialog;
