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
import UpdateAndApproveForm from "./UpdateAndAcceptForm";
import { Loader2Icon } from "lucide-react";
import { appointmentKeys } from "../../overview/useAppointments";

interface UpdateAndApproveDialogProps {
  appointment: Appointment;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateAndAcceptDialog = ({
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
      const endTime = endDate.toTimeString().slice(0, 5);

      const { error } = await supabase.functions.invoke("accept-appointment", {
        body: {
          id: values.id,
          email: values.email,
          end_time: endTime,
          duration: values.duration,
          advance_payment: values.advance_payment,
          price: values.price,
          notes: values.notes,
          action_type: "accept_appointment_with_updates",
        },
      });

      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Appointment successfully accepted!");
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.count({ status: "pending" }),
      });
      form.reset();
      setOpen(false);
    },
    onError: async (error: any) => {
      const status = error?.context?.status;
      const body = await error?.context?.json().catch(() => null);
      const message = body?.error;

      if (status === 409) {
        toast.error(message ?? "Appointment has already been accepted.");
        return;
      }

      toast.error(message ?? "Failed to accept appointment.");
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
      title="Edit and Accept appointment"
      description="Edit appointment details and Accept."
      className="md:max-w-lg"
      disableUpdate
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <UpdateAndApproveForm
              setValue={form.setValue}
              watch={form.watch}
              control={form.control}
              errors={form.formState.errors}
            />
          </div>
          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
            <Button
              disabled={updateAppointmentMutation.isPending}
              type="submit"
              className="flex-1"
            >
              {updateAppointmentMutation.isPending ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Accepting...
                </>
              ) : (
                "Accept"
              )}
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

export default UpdateAndAcceptDialog;
