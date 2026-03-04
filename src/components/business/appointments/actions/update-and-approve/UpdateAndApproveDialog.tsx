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
import { AppointmentSchema, type AppointmentFormValues } from "./form-schema";
import { Card } from "@/components/ui/card";
import UpdateAndApproveForm from "./UpdateAndApproveForm";

interface UpdateAndApproveDialogProps {
  appointment: Appointment;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateAndApproveDialog = ({
  appointment,
  open,
  setOpen,
}: UpdateAndApproveDialogProps) => {
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
      const [hours, minutes] = appointment.start_time.split(":").map(Number);
      const [year, month, day] = appointment.date.split("-").map(Number);

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
          email: values.email,
          end_time: endTime,
          duration: values.duration,
          advance_payment: values.advance_payment,
          price: values.price,
          status: "approved",
          notes: values.notes,
        })
        .eq("id", values.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Appointment successfully approved!");
      await queryClient.refetchQueries({ queryKey: ["appointments"] });
      form.reset();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve appointment.");
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
      title="Appointment"
      description="Update appointment details and approve."
      className="md:max-w-4xl"
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto">
            <UpdateAndApproveForm
              setValue={form.setValue}
              watch={form.watch}
              control={form.control}
              errors={form.formState.errors}
            />
          </Card>

          <div className="flex flex-col md:flex-row-reverse gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Approve
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

export default UpdateAndApproveDialog;
