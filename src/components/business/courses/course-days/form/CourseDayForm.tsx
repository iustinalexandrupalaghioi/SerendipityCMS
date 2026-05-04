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
import { ImagePreview } from "@/components/partials/ImagePreview";
import { Label } from "@/components/ui/label";

interface CourseDayFormProps {
  control: Control<CourseDayFormValues>;
  errors: FieldErrors<CourseDayFormValues>;
  mode: "Add" | "Update";
  existingImageUrl?: string;
  existingImagePath?: string;
  className?: string;
  disabled?: boolean;
}

const CourseDayForm = ({
  control,
  errors,
  mode,
  existingImageUrl,
  existingImagePath,
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
    <div className={cn("grid grid-cols-1 gap-8 max-w-lg", className)}>
      <div className="flex  md:items-center flex-col md:flex-row gap-6">
        {isUpdate && (
          <FormField
            control={control}
            name="display_id"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Id</FormLabel>
                <FormControl>
                  <Input disabled {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage>{errors.display_id?.message}</FormMessage>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="day_number"
          render={({ field }) => (
            <FormItem className="flex-1">
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
      </div>

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

      {existingImageUrl && (
        <div className="flex flex-col gap-2">
          <Label>Current image</Label>
          <ImagePreview
            src={existingImageUrl}
            alt="Current course image"
            filename={existingImagePath?.split("/").pop() ?? "image"}
          />
        </div>
      )}

      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem>
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
  );
};

export default CourseDayForm;
