import { FormCalendar } from "@/components/partials/FormCalendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import {
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form";
import type { OpenCourseEnrollmentFormValues } from "./form-schema";

interface OpenCourseEnrollmentFormProps {
  control: Control<OpenCourseEnrollmentFormValues>;
  errors: FieldErrors<OpenCourseEnrollmentFormValues>;
  setValue: UseFormSetValue<OpenCourseEnrollmentFormValues>;
  initialDate?: string;
}

const OpenCourseEnrollmentForm = ({
  control,
  errors,
  setValue,
  initialDate,
}: OpenCourseEnrollmentFormProps) => {
  /* =====================
     DATE HANDLING
  ====================== */
  const [date, setDate] = useState<string>(
    initialDate
      ? format(new Date(initialDate), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
  );

  useEffect(() => {
    if (initialDate) {
      setDate(format(new Date(initialDate), "yyyy-MM-dd"));
    }
  }, [initialDate]);

  useEffect(() => {
    setValue("start_date", date, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [date, setValue]);

  return (
    <div className="grid grid-cols-1 gap-8 w-full">
      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled
                  placeholder="Course name"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage>{errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Course location"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage>{errors.location?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>

      {/* DATE & CAPACITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCalendar
          value={date}
          label="Start date"
          startMonth={parseISO(date)}
          onChange={setDate}
        />

        <FormField
          control={control}
          name="available_spots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available spots</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Number of available spots"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage>{errors.available_spots?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>

      {/* PRICING */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (EUR)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Full price"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
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
              <FormLabel>Advance payment (EUR)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Advance payment amount"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage>{errors.advance_price?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default OpenCourseEnrollmentForm;
