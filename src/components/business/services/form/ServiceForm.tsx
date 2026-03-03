import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";

import { useEffect, useState } from "react";

import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import type { ServiceFormValues } from "./form-schema";
import useCategoryStore from "@/stores/CategoryStore";
import LookupFormInput from "@/components/partials/LookupFormInput";
import LookupCategoryDialog from "../../categories/list/PickupCategoryList";
import FileUpload from "@/components/partials/FileUpload";

interface ServiceFormProps {
  control: Control<ServiceFormValues>;
  errors: FieldErrors<ServiceFormValues>;
  setValue: UseFormSetValue<ServiceFormValues>;
  mode: "Add" | "Update";
  existingImageUrl?: string;
}

const ServiceForm = ({
  control,
  errors,
  setValue,
  mode,
  existingImageUrl,
}: ServiceFormProps) => {
  const { selectedCategory, setSelectedCategory } = useCategoryStore();

  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  /** When picking a category, update form value */
  useEffect(() => {
    if (selectedCategory) {
      setValue("category", selectedCategory, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setSelectedCategory(null);
    }
  }, [selectedCategory]);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          {/* ID (update only) */}
          {mode === "Update" && (
            <FormField
              control={control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage>{errors.id?.message}</FormMessage>
                </FormItem>
              )}
            />
          )}

          {/* Name */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Service name" {...field} />
                </FormControl>
                <FormMessage>{errors.title?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Active + Popular */}
          <div className="flex gap-6">
            <FormField
              control={control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <YesNoSwitch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage>{errors.is_active?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="is_popular"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Popular</FormLabel>
                  <FormControl>
                    <YesNoSwitch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage>{errors.is_popular?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          {/* Description (rich text placeholder keeps logic but uses Input for now) */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Detailed description of the service"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.description?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Category Picker */}
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Category</FormLabel>
                <FormControl>
                  <LookupFormInput
                    control={control}
                    displayKey="name"
                    name="category"
                    placeholder="Choose category"
                    value={field.value}
                    setOpen={setOpenCategoryDialog}
                  />
                </FormControl>
                <FormMessage>{errors.category?.message}</FormMessage>
              </FormItem>
            )}
          />

          {openCategoryDialog && (
            <LookupCategoryDialog
              open={openCategoryDialog}
              setOpen={setOpenCategoryDialog}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-start w-full">
            <FormField
              control={control}
              name="duration"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Duration"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {errors.duration ? (
                    <FormMessage>{errors.duration?.message}</FormMessage>
                  ) : errors.fill_price || errors.price ? (
                    "\u00A0"
                  ) : null}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Price (EUR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {errors.price ? (
                    <FormMessage>{errors.price?.message}</FormMessage>
                  ) : errors.fill_price || errors.duration ? (
                    "\u00A0"
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="fill_price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Fill price (EUR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Fill price"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {errors.fill_price ? (
                    <FormMessage>{errors.fill_price?.message}</FormMessage>
                  ) : errors.price || errors.duration ? (
                    "\u00A0"
                  ) : null}
                </FormItem>
              )}
            />
          </div>

          {/* Image Upload */}
          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service image</FormLabel>
                <FormControl>
                  <FileUpload
                    type="file"
                    label="Upload a service image"
                    title="Upload a service image"
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

        {/* Preview image */}
        {existingImageUrl && (
          <div className="flex flex-col gap-2 pt-6">
            <img
              src={existingImageUrl}
              alt="Current service image"
              className="h-36 w-full rounded-md border object-cover shadow-sm"
            />
            <p className="text-sm text-muted-foreground">Current image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceForm;
