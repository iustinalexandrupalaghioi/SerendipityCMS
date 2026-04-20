import FileUpload from "@/components/partials/FileUpload";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form";
import type { CourseFormValues } from "./form-schema";

interface CourseFormProps {
  control: Control<CourseFormValues>;
  errors: FieldErrors<CourseFormValues>;
  mode: "Add" | "Update" | "Details";
  setValue: UseFormSetValue<CourseFormValues>;
  fileInputKey?: number;
  existingImageUrl?: string;
  initialDate?: string;
  disabled?: boolean;
}

const CourseForm = ({
  control,
  errors,
  mode,
  existingImageUrl,
  setValue,
  fileInputKey,
  initialDate,
  disabled = false,
}: CourseFormProps) => {
  const isAdd = mode === "Add";
  const isUpdate = mode === "Update";
  const isDetails = mode === "Details";

  const disableEdit = disabled || isDetails;
  const disableOnUpdate = disabled || isUpdate || isDetails;

  const [date, setDate] = useState<string>(
    initialDate
      ? format(new Date(initialDate), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
  );

  useEffect(() => {
    if (initialDate) setDate(format(new Date(initialDate), "yyyy-MM-dd"));
  }, [initialDate]);

  useEffect(() => {
    setValue("start_date", date, { shouldDirty: true, shouldValidate: true });
  }, [date, setValue]);

  const availableSpots = useWatch({ control, name: "available_spots" });

  useEffect(() => {
    if (isAdd && typeof availableSpots === "number") {
      setValue("remaining_spots", availableSpots, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [availableSpots, isAdd, setValue]);

  return (
    <div className="w-full  grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
      {/* ── General ── */}
      <SectionCard title="General">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Course name"
                    disabled={disableEdit}
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
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Level</FormLabel>
                <Select
                  key={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disableEdit}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        "w-full",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "data-[state=open]:border-ring data-[state=open]:ring-ring/50 data-[state=open]:ring-[3px]",
                        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
                      )}
                    >
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage>{errors.level?.message}</FormMessage>
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
                    disabled={disableOnUpdate}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage>{errors.location?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of the course"
                    disabled={disableEdit}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage>{errors.description?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="display_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 1"
                    disabled={disableEdit}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage>{errors.display_order?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
      </SectionCard>

      {/* ── Schedule & Capacity ── */}
      <SectionCard title="Schedule & Capacity">
        <div className="grid grid-cols-1 gap-6">
          <FormCalendar
            disabled={disableOnUpdate}
            value={date}
            label="Start date"
            onChange={setDate}
          />

          {(isUpdate || isDetails) && (
            <FormField
              control={control}
              name="duration_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Duration in days"
                      disabled={disableOnUpdate}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage>{errors.duration_days?.message}</FormMessage>
                </FormItem>
              )}
            />
          )}

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
                    disabled={disableOnUpdate}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage>{errors.available_spots?.message}</FormMessage>
              </FormItem>
            )}
          />

          {(isUpdate || isDetails) && (
            <FormField
              control={control}
              name="remaining_spots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remaining spots</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Remaining spots"
                      disabled
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage>{errors.remaining_spots?.message}</FormMessage>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="is_open"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Open for enrollments</FormLabel>
                <FormControl>
                  <YesNoSwitch
                    disabled={disableOnUpdate}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage>{errors.is_open?.message}</FormMessage>
              </FormItem>
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
                <FormLabel>Price (EUR)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Full price"
                    disabled={disableOnUpdate}
                    aria-invalid={!!errors.price}
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
                    disabled={disableOnUpdate}
                    aria-invalid={!!errors.advance_price}
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
      </SectionCard>

      {/* ── Course image ── */}
      <SectionCard title="Course image">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload image</FormLabel>
                <FormControl>
                  <FileUpload
                    key={fileInputKey}
                    disabled={disableEdit}
                    label="Upload a course image"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage>{errors.image?.message}</FormMessage>
              </FormItem>
            )}
          />

          {existingImageUrl && (
            <div className="flex flex-col gap-2">
              <img
                src={existingImageUrl}
                alt="Current course"
                className="h-36 w-auto rounded-md border object-cover shadow-sm"
              />
              <p className="text-sm text-muted-foreground">Current image</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export default CourseForm;
