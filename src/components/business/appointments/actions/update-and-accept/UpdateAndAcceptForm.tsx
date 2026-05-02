import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { AppointmentFormValues } from "./form-schema";
import PickupFormInput from "@/components/partials/PickupFormInput";
import { AppointmentDatePicker } from "../../form/AppointmentDatePicker";
import { AppointmentTimePicker } from "../../form/AppointmentTimePicker";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import SectionCard from "@/components/partials/SectionCard";

interface UpdateAndAcceptFormProps {
  control: Control<AppointmentFormValues>;
  errors: FieldErrors<AppointmentFormValues>;
  setValue: UseFormSetValue<AppointmentFormValues>;
  watch: UseFormWatch<AppointmentFormValues>;
}

const UpdateAndAcceptForm = ({
  control,
  errors,
  setValue,
  watch,
}: UpdateAndAcceptFormProps) => {
  const duration = watch("duration");
  const startTime = watch("start_time");
  /* Sync end time into form */
  useEffect(() => {
    if (!duration || !startTime) return;

    const [hours, minutes] = startTime.split(":").map(Number);
    const endDate = new Date(0, 0, 0, hours, minutes + duration);
    const endTime = endDate.toTimeString().slice(0, 5); // "HH:MM"

    setValue("end_time", endTime, { shouldDirty: true });
  }, [duration, setValue]);

  return (
    <div className="w-full max-w-full mx-auto py-2 space-y-4">
      <SectionCard title="Customer">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    className="bg-muted text-muted-foreground"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    className="bg-muted text-muted-foreground"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.email?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
      </SectionCard>

      <SectionCard title="Appointment details">
        <div className="grid grid-cols-1 gap-6">
          <PickupFormInput
            disabled
            displayKey="title"
            control={control}
            name="service"
            label="Service"
            placeholder="Select a service"
            error={errors.service?.message}
          />

          <FormField
            name="date"
            render={({ field }) => (
              <AppointmentDatePicker
                label="Date"
                value={field.value}
                disabled
              />
            )}
          />

          <FormField
            name="start_time"
            render={({ field }) => (
              <AppointmentTimePicker
                label="Start time"
                value={field.value}
                disabled
                formError={errors.start_time?.message}
              />
            )}
          />

          <FormField
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage>{errors.duration?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            name="end_time"
            render={({ field }) => (
              <AppointmentTimePicker
                label="End time"
                value={field.value}
                disabled
                formError={errors.end_time?.message}
              />
            )}
          />
        </div>
      </SectionCard>

      <SectionCard title="Pricing">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-12"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      EUR
                    </span>
                  </div>
                </FormControl>
                <FormMessage>{errors.price?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            name="advance_payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advance payment</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-12"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      EUR
                    </span>
                  </div>
                </FormControl>
                <FormMessage>{errors.advance_payment?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
      </SectionCard>

      {/* ── Customer notes ── */}
      <SectionCard title="Customer notes">
        <FormField
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="This message will be visible to the customer..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage>{errors.notes?.message}</FormMessage>
            </FormItem>
          )}
        />
      </SectionCard>
    </div>
  );
};

export default UpdateAndAcceptForm;
