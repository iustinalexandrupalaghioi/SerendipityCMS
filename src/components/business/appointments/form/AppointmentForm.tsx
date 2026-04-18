import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PickupFormInput from "@/components/partials/PickupFormInput";
import SectionCard from "@/components/partials/SectionCard";
import { Input } from "@/components/ui/input";
import { useAvailableHours } from "@/hooks/useAvailableHours";
import { useFullyBookedDates } from "@/hooks/useBookedDates";
import type { Service } from "@/types/Service";
import type { Profile } from "@/types/User";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import ServicePickup from "../../services/pickup/ServicePickup";
import UserPickup from "../../users/pickup/UserPickup";
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

  const duration = watch("duration");
  const appointmentId = watch("id");
  const date = watch("date");
  const user = watch("user");

  const [disabledNameEmail, setDisabledNameEmail] =
    useState<boolean>(!!appointmentId);
  const [isServicePickupOpen, setServicePickupOpen] = useState(false);
  const [isUserPickupOpen, setUserPickupOpen] = useState(false);

  const { data: bookedDates } = useFullyBookedDates({
    serviceDuration: duration,
    enabled: !!date && !!duration,
  });

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

  // ── Auto-advance date if today is fully booked ────────────────────────────
  useEffect(() => {
    if (!bookedDates || bookedDates.length === 0) return;

    const today = new Date();
    const isTodayBooked = bookedDates.some(
      (d) => format(new Date(d), "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
    );

    if (isTodayBooked && (!date || date === format(today, "yyyy-MM-dd"))) {
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

  // ── Pickup handlers ───────────────────────────────────────────────────────
  const handleServiceSelect = (service: Service) => {
    setValue("service", service, { shouldDirty: true });
    setValue("price", Number(service.price), { shouldDirty: true });
    setValue("advance_payment", Number(service.advance_price), {
      shouldDirty: true,
    });
    setValue("duration", Number(service.duration), { shouldDirty: true });
  };

  const handleUserSelect = (user: Profile) => {
    setValue("user", user, { shouldDirty: true });
    setValue("name", `${user.first_name} ${user.last_name}`, {
      shouldDirty: true,
    });
    setValue("email", user.email, { shouldDirty: true });
    setDisabledNameEmail(true);
  };

  return (
    <div className="w-full py-2 space-y-4">
      {/* ── Customer ── */}
      <SectionCard title="Customer">
        <div className="grid grid-cols-1 gap-6">
          <PickupFormInput
            disabled={disabled || mode === "Approve"}
            displayKey="full_name"
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

          {!user && (
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g. John Doe"
                      disabled={disabled || disabledNameEmail}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g. john@example.com"
                    disabled={disabled || disabledNameEmail}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.email?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
      </SectionCard>

      {/* ── Appointment details ── */}
      <SectionCard title="Appointment details">
        <div className="grid grid-cols-1 gap-6">
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

          <FormField
            control={control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 60"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.duration?.message}</FormMessage>
              </FormItem>
            )}
          />

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
                formError={errors.start_time?.message}
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
                      type="number"
                      className="pr-12"
                      placeholder="e.g. 49.99"
                      disabled={disabled}
                      aria-invalid={!!errors.price}
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
                <FormLabel>Advance price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-12"
                      placeholder="e.g. 49.99"
                      disabled={disabled}
                      aria-invalid={!!errors.advance_payment}
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

      {/* ── Service image ── */}
      {existingImageUrl && (
        <SectionCard title="Service image">
          <img
            src={existingImageUrl}
            alt="Current service"
            className="h-36 w-auto rounded-md border object-cover"
          />
        </SectionCard>
      )}

      {/* ── Pickup dialogs ── */}
      {isUserPickupOpen && (
        <UserPickup
          open={isUserPickupOpen}
          setOpen={setUserPickupOpen}
          onSelect={handleUserSelect}
        />
      )}

      {isServicePickupOpen && (
        <ServicePickup
          open={isServicePickupOpen}
          setOpen={setServicePickupOpen}
          onSelect={handleServiceSelect}
        />
      )}
    </div>
  );
};

export default AppointmentForm;
