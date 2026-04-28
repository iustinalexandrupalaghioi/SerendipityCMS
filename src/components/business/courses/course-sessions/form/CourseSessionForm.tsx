import { FormCalendar } from "@/components/partials/FormCalendar";
import SectionCard from "@/components/partials/SectionCard";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";
import { format } from "date-fns/format";
import { useEffect, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { CourseSessionFormValues } from "./form-schema";

interface CourseSessionFormProps {
  control: Control<CourseSessionFormValues>;
  errors: FieldErrors<CourseSessionFormValues>;
  setValue: UseFormSetValue<CourseSessionFormValues>;
  watch: UseFormWatch<CourseSessionFormValues>;
  initialDate?: string;
  mode: "Add" | "Update";
  disabled?: boolean;
}

const CourseSessionForm = ({
  control,
  errors,
  initialDate,
  setValue,
  watch,
  disabled = false,
}: CourseSessionFormProps) => {
  const [date, setDate] = useState<string>(
    initialDate
      ? format(new Date(initialDate), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
  );

  const availableSpots = watch("available_spots");
  const remainingSpots = watch("remaining_spots");

  // ── Sync date into form ───────────────────────────────────────────────────
  useEffect(() => {
    if (initialDate) setDate(format(new Date(initialDate), "yyyy-MM-dd"));
  }, [initialDate]);

  useEffect(() => {
    setValue("start_date", date, { shouldDirty: true, shouldValidate: true });
  }, [date, setValue]);

  useEffect(() => {
    setValue("remaining_spots", availableSpots, { shouldValidate: true });
  }, [availableSpots]);

  const booked = (availableSpots ?? 0) - (remainingSpots ?? 0);

  return (
    <div className="w-full py-2 space-y-4">
      {/* ── Schedule ── */}
      <SectionCard title="Schedule">
        <FormCalendar
          disabled={disabled}
          value={date}
          label="Start date"
          onChange={setDate}
        />
      </SectionCard>

      {/* ── Pricing ── */}
      <SectionCard title="Pricing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-12"
                      placeholder="e.g. 950"
                      aria-invalid={!!errors.price}
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
            name="advance_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advance price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-12"
                      placeholder="e.g. 200"
                      aria-invalid={!!errors.advance_price}
                      value={field.value ?? ""}
                      disabled={disabled}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      EUR
                    </span>
                  </div>
                </FormControl>
                <FormMessage>{errors.advance_price?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
      </SectionCard>

      {/* ── Availability ── */}
      <SectionCard title="Availability">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <FormField
            control={control}
            name="available_spots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available spots</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 4"
                    aria-invalid={!!errors.available_spots}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage>{errors.available_spots?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="remaining_spots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Remaining spots{" "}
                  {booked > 0 && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      ({booked} booked)
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    disabled
                    type="number"
                    placeholder="e.g. 4"
                    aria-invalid={!!errors.remaining_spots}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage>{errors.remaining_spots?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="is_open"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Open for enrollment</FormLabel>
              <FormControl>
                <YesNoSwitch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage>{errors.is_open?.message}</FormMessage>
            </FormItem>
          )}
        />
      </SectionCard>
    </div>
  );
};

export default CourseSessionForm;
