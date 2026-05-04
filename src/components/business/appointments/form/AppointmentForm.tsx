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
import { Combobox } from "@/components/partials/Combobox";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";
import { APPOINTMENT_STATUS_OPTIONS } from "@/types/Appointment";
import { useAvailableHours } from "@/hooks/useAvailableHours";
import { useFullyBookedDates } from "@/hooks/useBookedDates";
import useUserStore from "@/stores/UserStore";
import useServiceStore from "@/stores/ServiceStore";
import UserPickup from "../../users/pickup/UserPickup";
import ServicePickup from "../../services/pickup/ServicePickup";
import { AppointmentDatePicker } from "./AppointmentDatePicker";
import { AppointmentTimePicker } from "./AppointmentTimePicker";
import type { AppointmentFormValues } from "./form-schema";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { ImagePreview } from "@/components/partials/ImagePreview";

interface AppointmentFormProps {
  control: Control<AppointmentFormValues>;
  setValue: UseFormSetValue<AppointmentFormValues>;
  errors: FieldErrors<AppointmentFormValues>;
  watch: UseFormWatch<AppointmentFormValues>;
  mode: "Add" | "Update" | "Reject" | "Approve";
  existingImageUrl?: string;
}

const GRID = "grid grid-cols-1 md:grid-cols-4 gap-4 items-start";

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
  const service = watch("service");
  const advance_payment_paid = watch("advance_payment_paid");

  const { selectedUser, setSelectedUser } = useUserStore();
  const { selectedService, setSelectedService } = useServiceStore();

  const [isUserPickupOpen, setUserPickupOpen] = useState(false);
  const [isServicePickupOpen, setServicePickupOpen] = useState(false);

  // ── Sync picked user ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedUser) return;
    setValue("user", selectedUser, { shouldDirty: true });
    setValue("name", selectedUser.full_name, { shouldDirty: true });
    setValue("email", selectedUser.email, { shouldDirty: true });
    setSelectedUser(null);
  }, [selectedUser, setValue]);

  // ── Sync picked service ───────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedService) return;
    setValue("service", selectedService, { shouldDirty: true });
    setValue("price", Number(selectedService.price), { shouldDirty: true });
    setValue("advance_payment", Number(selectedService.advance_price), {
      shouldDirty: true,
    });
    setValue("duration", Number(selectedService.duration), {
      shouldDirty: true,
    });
    setSelectedService(null);
  }, [selectedService, setValue]);

  // ── Auto-advance date if today is fully booked ────────────────────────────
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
    duration,
    enabled: false,
    appointmentId,
  });

  useEffect(() => {
    if (!bookedDates?.length) return;
    const today = new Date();
    const fmt = (d: Date) => format(d, "yyyy-MM-dd");
    const isBooked = (d: Date) =>
      bookedDates.some((b) => fmt(new Date(b)) === fmt(d));
    if (isBooked(today) && (!date || date === fmt(today))) {
      let next = new Date(today);
      while (isBooked(next)) next.setDate(next.getDate() + 1);
      setValue("date", fmt(next));
    }
  }, [bookedDates, date, setValue]);

  return (
    <div className="w-full py-2 space-y-4">
      {/* ── Customer ── */}
      <SectionCard title="Customer">
        <div className={GRID}>
          <PickupFormInput
            disabled={disabled || mode === "Approve"}
            displayKey="display_id"
            control={control}
            name="user"
            label="Customer"
            error={errors.user?.message}
            setOpen={setUserPickupOpen}
            onClear={() => {
              setValue("name", "", { shouldDirty: true });
              setValue("email", "", { shouldDirty: true });
            }}
          />

          <FormItem className="md:col-span-3 w-full">
            <FormLabel>Full name</FormLabel>
            <Input
              disabled
              placeholder="e.g. John Doe"
              value={user?.full_name ?? ""}
            />
          </FormItem>
          <FormItem className="md:col-span-4 w-full">
            <FormLabel>Email</FormLabel>
            <Input
              disabled
              type="email"
              placeholder="e.g. john@example.com"
              value={user?.email ?? ""}
            />
          </FormItem>
        </div>
      </SectionCard>

      {/* ── Appointment details ── */}
      <SectionCard title="Appointment details">
        <div className={GRID}>
          <PickupFormInput
            disabled={disabled}
            displayKey="display_id"
            control={control}
            name="service"
            label="Service"
            error={errors.service?.message}
            setOpen={setServicePickupOpen}
            onClear={() => {
              setValue("duration", 0, { shouldDirty: true });
              setValue("price", 0, { shouldDirty: true });
            }}
          />
          <FormItem className="md:col-span-3 w-full">
            <FormLabel>Service name</FormLabel>
            <Input
              disabled
              placeholder="e.g. Manicure"
              value={service?.title ?? ""}
            />
          </FormItem>

          {existingImageUrl && (
            <FormItem className="md:col-span-4">
              <FormLabel>Service image</FormLabel>
              <ImagePreview
                src={existingImageUrl}
                alt="Current service"
                filename={service.image_path.split("/").slice(-1)[0]}
              />
            </FormItem>
          )}

          <FormField
            control={control}
            name="duration"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Duration (min)</FormLabel>
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
        <div className={GRID}>
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
          {mode === "Update" && (
            <>
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Combobox
                  items={APPOINTMENT_STATUS_OPTIONS}
                  value={watch("status") ?? "pending"}
                  placeholder="Appointment status"
                  disabled
                  className="w-full capitalize"
                />
              </FormItem>
              <FormItem>
                <FormLabel>Deposit paid</FormLabel>
                <YesNoSwitch checked={!!advance_payment_paid} disabled />
              </FormItem>
            </>
          )}
        </div>
      </SectionCard>

      {/* ── Dialogs ── */}
      {isUserPickupOpen && (
        <UserPickup
          open={isUserPickupOpen}
          setOpen={setUserPickupOpen}
          onSelect={setSelectedUser}
        />
      )}
      {isServicePickupOpen && (
        <ServicePickup
          open={isServicePickupOpen}
          setOpen={setServicePickupOpen}
          onSelect={setSelectedService}
        />
      )}
    </div>
  );
};

export default AppointmentForm;
