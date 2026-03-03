import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldErrors } from "react-hook-form";
import type { FreeDayFormValues } from "./form-schema";
import { FormCalendar } from "@/components/partials/FormCalendar";

interface FreeDayFormProps {
  control: Control<FreeDayFormValues>;
  errors: FieldErrors<FreeDayFormValues>;
  mode: "Add" | "Update";
}

const FreeDayForm = ({ control, errors, mode }: FreeDayFormProps) => {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6">
      {/* ID (only for update mode) */}
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
        name="date_from"
        render={({ field }) => (
          <FormCalendar
            label="Date from"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <FormField
        control={control}
        name="date_until"
        render={({ field }) => (
          <FormCalendar
            label="Date until"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
};

export default FreeDayForm;
