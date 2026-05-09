import FileUpload from "@/components/partials/FileUpload";
import { ImagePreview } from "@/components/partials/ImagePreview";
import SectionCard from "@/components/partials/SectionCard";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form";
import type { CourseFormValues } from "./form-schema";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";

interface CourseFormProps {
  control: Control<CourseFormValues>;
  errors: FieldErrors<CourseFormValues>;
  mode: "Add" | "Update" | "Details";
  setValue: UseFormSetValue<CourseFormValues>;
  defaultValues: CourseFormValues;
  fileInputKey?: number;
  existingImageUrl?: string;
  existingImagePath?: string;
  initialDate?: string;
  disabled?: boolean;
  courseStats?: CourseStats;
}

export interface CourseStats {
  available_spots: number;
  remaining_spots: number;
  is_open: boolean;
}

const CourseForm = ({
  control,
  errors,
  existingImageUrl,
  fileInputKey,
  disabled = false,
  defaultValues,
  courseStats,
}: CourseFormProps) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ── Course details ── */}
      <SectionCard title="Course details">
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
                    disabled={disabled}
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
                <FormLabel>Course level</FormLabel>
                <Select
                  key={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of the course"
                    disabled={disabled}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage>{errors.description?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
      </SectionCard>

      {/* ── Pricing & Logistics ── */}
      <SectionCard title="Pricing & Logistics">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-12"
                      placeholder="e.g. 950"
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
            name="advance_price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Deposit</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-12"
                      placeholder="e.g. 950"
                      aria-invalid={!!errors.advance_price}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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

          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Course location"
                    disabled={disabled}
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
            name="duration_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Duration in days"
                    disabled
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage>{errors.duration_days?.message}</FormMessage>
              </FormItem>
            )}
          />

          {courseStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormItem>
                <FormLabel>Available spots</FormLabel>
                <Input value={courseStats?.available_spots ?? "—"} disabled />
              </FormItem>

              <FormItem>
                <FormLabel>Remaining spots</FormLabel>
                <Input value={courseStats?.remaining_spots ?? "—"} disabled />
              </FormItem>

              <FormItem>
                <FormLabel>Open</FormLabel>
                <YesNoSwitch checked={courseStats?.is_open ?? false} disabled />
              </FormItem>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Media & display ── */}
      <SectionCard title="Media & display">
        <div className="grid grid-cols-1 gap-6">
          {existingImageUrl && (
            <div className="flex flex-col gap-2">
              <Label>Current image</Label>
              <ImagePreview
                src={existingImageUrl}
                alt="Current course image"
                filename={defaultValues.image_path?.split("/").pop() ?? "image"}
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
                    key={fileInputKey}
                    disabled={disabled}
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
                    disabled={disabled}
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
    </div>
  );
};

export default CourseForm;
