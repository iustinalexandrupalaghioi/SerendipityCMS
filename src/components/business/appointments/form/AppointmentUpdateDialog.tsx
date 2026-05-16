import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import type { Appointment } from "@/types/Appointment";
import { DialogClose } from "@radix-ui/react-dialog";
import AppointmentForm from "./AppointmentForm";
import { AppointmentSchema, type AppointmentFormValues } from "./form-schema";
import { formatTime } from "@/lib/utils";

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
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      display_id: appointment.display_id,
      id: appointment.id,
      service: appointment.service,
      user: appointment.profile,
      name: appointment.name,
      email: appointment.email,
      date: appointment.date,
      start_time: formatTime(appointment.start_time),
      duration: Number(appointment.duration) || undefined,
      price: Number(appointment.price) || undefined,
      advance_payment: Number(appointment.advance_payment),
      advance_payment_paid: appointment.advance_payment_paid,
      status: appointment.status,
    },
  });

  /* Reset form when dialog closes */
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title="Appointment"
      description="Appointment details."
      className="md:max-w-lg"
      disableUpdate
    >
      <Form {...form}>
        <form className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <AppointmentForm
              setValue={form.setValue}
              control={form.control}
              errors={form.formState.errors}
              watch={form.watch}
              mode="Update"
              existingImageUrl={appointment.service.image_public_url}
            />
          </div>

          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
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
