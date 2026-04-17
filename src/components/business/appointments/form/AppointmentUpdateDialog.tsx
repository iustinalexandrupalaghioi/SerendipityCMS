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
import AppointmentForm from "./AppointmentForm";
import { AppointmentSchema, type AppointmentFormValues } from "./form-schema";

interface AppointmentUpdateDialogProps {
  appointment: Appointment;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppointmentUpdateDialog = ({
  appointment,
  open,
  setOpen,
}: AppointmentUpdateDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      id: appointment.id,
      service: appointment.service,
      user: appointment.profile,
      name: appointment.name,
      email: appointment.email,
      date: appointment.date,
      start_time: appointment.start_time.slice(0, 5),
      duration: Number(appointment.duration) || undefined,
      price: Number(appointment.price) || undefined,
      advance_payment: Number(appointment.advance_payment),
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
      const { error } = await supabase
        .from("appointment")
        .update({
          service_id: values.service.id,
          user_id: values.user?.id || null,
          name: values.name,
          email: values.email,
          date: values.date,
          start_time: values.start_time,
          end_time: endTime,
          duration: values.duration,
          price: values.price,
          advance_payment: values.advance_payment,
        })
        .eq("id", values.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Appointment updated successfully!");
      await queryClient.refetchQueries({ queryKey: ["appointments"] });
      form.reset();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update appointment.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateAppointmentMutation.mutate(values);
  });

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title="Appointment"
      description="Appointment details."
      className="md:max-w-6xl"
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <AppointmentForm
            setValue={form.setValue}
            control={form.control}
            errors={form.formState.errors}
            watch={form.watch}
            mode="Update"
            existingImageUrl={appointment.service.image_public_url}
          />

          <div className="flex flex-col md:flex-row-reverse gap-2 pt-4">
            <DialogClose asChild className="flex-1">
              <Button type="button" className="w-full">
                Ok
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </UpdateDialog>
  );
};

export default AppointmentUpdateDialog;
