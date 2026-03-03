import FileUpload from "@/components/partials/FileUpload";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type Control, type FieldErrors } from "react-hook-form";
import type { CourseDayFormValues } from "./form-schema";

interface CourseDayFormProps {
  control: Control<CourseDayFormValues>;
  errors: FieldErrors<CourseDayFormValues>;
  mode: "Add" | "Update";
  existingImageUrl?: string;
  className?: string;
  disabled?: boolean;
}

const CourseDayForm = ({
  control,
  errors,
  mode,
  existingImageUrl,
  className,
  disabled = false,
}: CourseDayFormProps) => {
  /* =====================
     MODE RULES
  ====================== */
  const isUpdate = mode === "Update";
  const disableEdit = disabled;

  /* =====================
     COURSE PICKUP
  ====================== */

  return (
    <div
      className={cn("grid grid-cols-1 lg:grid-cols-5 gap-8 w-full", className)}
    >
      {/* ================= LEFT FORM ================= */}
      <div className="lg:col-span-2">
        {/* limit form width */}
        <div className="flex flex-col gap-6 max-w-xl">
          {isUpdate && (
            <FormField
              control={control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input disabled {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage>{errors.id?.message}</FormMessage>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Course day title"
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
            name="day_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Day number"
                    disabled={disableEdit}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage>{errors.day_number?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course day image</FormLabel>
                <FormControl>
                  <FileUpload
                    disabled={disableEdit}
                    label="Upload a course day image"
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
        </div>
      </div>

      {/* ================= RIGHT IMAGE PREVIEW ================= */}
      {existingImageUrl && (
        <div className="lg:col-span-1 self-start">
          <img
            src={existingImageUrl}
            alt="Current course day"
            className="h-40 w-full rounded-md border object-cover"
          />
          <p className="text-sm text-muted-foreground mt-1">Current image</p>
        </div>
      )}
    </div>
  );
};

export default CourseDayForm;
