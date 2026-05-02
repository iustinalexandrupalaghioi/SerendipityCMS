import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import PickupFormInput from "@/components/partials/PickupFormInput";
import SectionCard from "@/components/partials/SectionCard";
import { Textarea } from "@/components/ui/textarea";
import type { Control, FieldErrors } from "react-hook-form";
import { AppointmentDatePicker } from "../../form/AppointmentDatePicker";
import { AppointmentTimePicker } from "../../form/AppointmentTimePicker";
import type { AppointmentFormValues } from "./form-schema";

interface DeclineAppointmentFormProps {
  control: Control<AppointmentFormValues>;
  errors: FieldErrors<AppointmentFormValues>;
}

const DeclineAppointmentForm = ({
  control,
  errors,
}: DeclineAppointmentFormProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-2 space-y-4">
      {/* ── Appointment details ── */}

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
            control={control}
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
            control={control}
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
            control={control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    disabled
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
            control={control}
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

      {/* ── Pricing ── */}
      <SectionCard title="Pricing">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      disabled
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
            control={control}
            name="advance_payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advance payment</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      disabled
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
          control={control}
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

export default DeclineAppointmentForm;
