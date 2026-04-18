import FileUpload from "@/components/partials/FileUpload";
import PickupFormInput from "@/components/partials/PickupFormInput";
import SectionCard from "@/components/partials/SectionCard";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";
import useCategoryStore from "@/stores/CategoryStore";
import { useEffect, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import CategoryPickup from "../../categories/pickup/CategoryPickup";
import type { ServiceFormValues } from "./form-schema";

interface ServiceFormProps {
  control: Control<ServiceFormValues>;
  errors: FieldErrors<ServiceFormValues>;
  setValue: UseFormSetValue<ServiceFormValues>;
  mode: "Add" | "Update";
  existingImageUrl?: string;
  watch: UseFormWatch<ServiceFormValues>;
}

const ServiceForm = ({
  control,
  errors,
  setValue,
  mode,
  existingImageUrl,
  watch,
}: ServiceFormProps) => {
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const price = watch("price");

  useEffect(() => {
    if (selectedCategory) {
      setValue("category", selectedCategory, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setSelectedCategory(null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (price) {
      setValue("advance_price", Number(price) / 2, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [price]);

  return (
    <div className="w-full py-2 space-y-4">
      {/* ── General ── */}
      <SectionCard title="General">
        <div className="grid grid-cols-1 gap-6">
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

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of the service"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.description?.message}</FormMessage>
              </FormItem>
            )}
          />

          <PickupFormInput
            displayKey="name"
            control={control}
            name="category"
            label="Category"
            placeholder="Select a category"
            error={errors.category?.message}
            setOpen={setOpenCategoryDialog}
          />

          {openCategoryDialog && (
            <CategoryPickup
              onSelect={setSelectedCategory}
              open={openCategoryDialog}
              setOpen={setOpenCategoryDialog}
            />
          )}

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
        </div>
      </SectionCard>

      {/* ── Pricing & Duration ── */}
      <SectionCard title="Pricing & Duration">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-start">
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
                {errors.duration && (
                  <div className="min-h-5">
                    <FormMessage>{errors.duration?.message}</FormMessage>
                  </div>
                )}
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
                {errors.price && (
                  <div className="min-h-5">
                    <FormMessage>{errors.price?.message}</FormMessage>
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="advance_price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Advance price (EUR)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Advance price"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                {errors.advance_price && (
                  <div className="min-h-5">
                    <FormMessage>{errors.advance_price?.message}</FormMessage>
                  </div>
                )}
              </FormItem>
            )}
          />
        </div>
      </SectionCard>

      {/* ── Service image ── */}
      <SectionCard title="Service image">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload image</FormLabel>
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

          {existingImageUrl && (
            <div className="flex flex-col gap-2">
              <img
                src={existingImageUrl}
                alt="Current service image"
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

export default ServiceForm;
