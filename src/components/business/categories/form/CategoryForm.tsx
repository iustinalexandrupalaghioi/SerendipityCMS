import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldErrors } from "react-hook-form";
import type { CategoryFormValues } from "./form-schema";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";
import { Textarea } from "@/components/ui/textarea";

interface CategoryFormProps {
  control: Control<CategoryFormValues>;
  errors: FieldErrors<CategoryFormValues>;
  mode: "Add" | "Update";
}

const CategoryForm = ({ control, errors, mode }: CategoryFormProps) => {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6">
      {/* Category ID (only for update mode) */}
      {mode === "Update" && (
        <FormField
          control={control}
          name="display_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Id</FormLabel>
              <FormControl>
                <Input id="categoryId" disabled {...field} />
              </FormControl>
              <FormMessage>{errors.display_id?.message}</FormMessage>
            </FormItem>
          )}
        />
      )}

      {/* Name Field */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input id="name" placeholder="Enter category name" {...field} />
            </FormControl>
            <FormMessage>{errors.name?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Description Field */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                id="description"
                placeholder="Short description (optional)"
                {...field}
              />
            </FormControl>
            <FormMessage>{errors.description?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Active Checkbox */}
      <FormField
        control={control}
        name="is_active"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium">Active</FormLabel>
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
    </div>
  );
};

export default CategoryForm;
