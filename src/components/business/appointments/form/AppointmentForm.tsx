import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// import { useAvailableWorkHours } from "@/hooks/common/use-available-work-hours";
// import { useBookedDates } from "@/hooks/common/use-booked-dates";
import useServiceStore from "@/stores/ServiceStore";
import useUserStore from "@/stores/UserStore";

import PickupServiceList from "../../services/list/PickupServiceList";
import PickupUserList from "../../users/list/PickupUserList";

import PickupFormInput from "@/components/partials/PickupFormInput";
import { Input } from "@/components/ui/input";
import { useAvailableHours } from "@/hooks/useAvailableHours";
import { useFullyBookedDates } from "@/hooks/useBookedDates";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { AppointmentDatePicker } from "./AppointmentDatePicker";
import { AppointmentTimePicker } from "./AppointmentTimePicker";
import type { AppointmentFormValues } from "./form-schema";

interface AppointmentFormProps {
  control: Control<AppointmentFormValues>;
  setValue: UseFormSetValue<AppointmentFormValues>;
  errors: FieldErrors<AppointmentFormValues>;
  watch: UseFormWatch<AppointmentFormValues>;
  mode: "Add" | "Update" | "Reject" | "Approve";
  existingImageUrl?: string;
}

const AppointmentForm = ({
  control,
  errors,
  watch,
  mode,
  setValue,
  existingImageUrl,
}: AppointmentFormProps) => {
  const disabled = mode === "Update";

  const { selectedService, setSelectedService } = useServiceStore();
  const { selectedUser, setSelectedUser } = useUserStore();
  const duration = watch("duration");
  const appointmentId = watch("id");
  const date = watch("date"); // yyyy-MM-dd
  const [disabledNameEmail, setDisabledNameEmail] = useState<boolean>(
    appointmentId ? true : false,
  );

  const { data: bookedDates } = useFullyBookedDates({
    serviceDuration: duration,
    enabled: !!date && !!duration,
  });

  useEffect(() => {
    if (!bookedDates || bookedDates.length === 0) return;

    const today = new Date();
    const isTodayBooked = bookedDates.some(
      (d) => format(new Date(d), "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
    );

    if (isTodayBooked && (!date || date === format(today, "yyyy-MM-dd"))) {
      // find the next available date
      let nextDate = new Date(today);
      while (
        bookedDates.some(
          (d) =>
            format(new Date(d), "yyyy-MM-dd") ===
            format(nextDate, "yyyy-MM-dd"),
        )
      ) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      setValue("date", format(nextDate, "yyyy-MM-dd"));
    }
  }, [bookedDates, date, setValue]);

  const {
    data: activeWorkHours,
    refetch: refetchAvailableHours,
    isLoading,
    error,
  } = useAvailableHours({
    date: format(date ? parseISO(date) : new Date(), "yyyy-MM-dd"),
    duration: duration,
    enabled: false,
    appointmentId,
  });

  const [isServicePickupOpen, setServicePickupOpen] = useState(false);
  const [isUserPickupOpen, setUserPickupOpen] = useState(false);

  /* Sync picked service into form */
  useEffect(() => {
    if (!selectedService) return;

    setValue("service", selectedService, { shouldDirty: true });
    setValue("price", Number(selectedService.price), { shouldDirty: true });
    setValue("duration", Number(selectedService.duration), {
      shouldDirty: true,
    });

    setSelectedService(null);
  }, [selectedService, setValue]);

  useEffect(() => {
    if (!selectedUser) return;

    setValue("user", selectedUser, { shouldDirty: true });
    setValue("name", selectedUser.first_name + " " + selectedUser.last_name, {
      shouldDirty: true,
    });
    setValue("email", selectedUser.email, { shouldDirty: true });
    setDisabledNameEmail(true);
    setSelectedUser(null);
  }, [selectedUser, setValue]);

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full p-6">
      <div className="flex-1 flex flex-col gap-6">
        {/* Customer */}
        <PickupFormInput
          disabled={disabled || mode === "Approve"}
          displayKey="email"
          control={control}
          name="user"
          label="Customer"
          placeholder="Select a customer"
          onClear={() => {
            setValue("name", "", { shouldDirty: true });
            setValue("email", "", { shouldDirty: true });
            setDisabledNameEmail(false);
          }}
          error={errors.user?.message}
          setOpen={setUserPickupOpen}
        />

        {isUserPickupOpen && (
          <PickupUserList open={isUserPickupOpen} setOpen={setUserPickupOpen} />
        )}

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="input"
                  placeholder="e.g. John Doe"
                  disabled={disabled || disabledNameEmail}
                  {...field}
                />
              </FormControl>
              <FormMessage>{errors.name?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="input"
                  placeholder="e.g. john@example.com"
                  disabled={disabled || disabledNameEmail}
                  {...field}
                />
              </FormControl>
              <FormMessage>{errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Service */}
        <PickupFormInput
          disabled={disabled}
          displayKey="title"
          control={control}
          name="service"
          label="Service"
          placeholder="Select a service"
          error={errors.service?.message}
          setOpen={setServicePickupOpen}
          onClear={() => {
            setValue("duration", 0, { shouldDirty: true });
            setValue("price", 0, { shouldDirty: true });
          }}
        />

        {isServicePickupOpen && (
          <PickupServiceList
            open={isServicePickupOpen}
            setOpen={setServicePickupOpen}
          />
        )}

        {/* Duration */}
        <FormField
          control={control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="input"
                  placeholder="e.g. 60"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage>{errors.duration?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Price (EUR)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 49.99"
                  disabled={disabled}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage>{errors.price?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <AppointmentDatePicker
              label="Date"
              value={field.value}
              onChange={field.onChange}
              disabled={!duration || disabled}
              unavailableDates={bookedDates}
            />
          )}
        />

        {/* Time */}
        <FormField
          control={control}
          name="start_time"
          render={({ field }) => (
            <AppointmentTimePicker
              onOpen={refetchAvailableHours}
              label="Time"
              value={field.value}
              onChange={field.onChange}
              date={date}
              data={activeWorkHours}
              isLoading={isLoading}
              error={error}
              disabled={!duration || !date || disabled}
            />
          )}
        />
      </div>

      {/* Image preview */}
      {existingImageUrl && (
        <div className="flex flex-col gap-2 pt-4">
          <img
            src={existingImageUrl}
            alt="Current service"
            className="h-36 w-full rounded-md border object-cover"
          />
          <p className="text-sm text-muted-foreground">Current image</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
