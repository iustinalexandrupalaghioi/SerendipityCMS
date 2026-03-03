import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { YesNoSwitch } from "@/components/ui/yes-no-switch";

import type { Control } from "react-hook-form";
import type { ShiftFormValues } from "./form-schema";
import { Clock2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ShiftFormProps {
  control: Control<ShiftFormValues>;
  mode: "Add" | "Update";
}

const ShiftForm = ({ control, mode }: ShiftFormProps) => {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6">
      {/* ID (Update Only) */}
      {mode === "Update" && (
        <FormField
          control={control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Id</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput disabled {...field} />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Start Time */}
      <FormField
        control={control}
        name="day_start_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start time</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <Clock2Icon className="h-4 w-4 text-gray-500" />
                </InputGroupAddon>
                <InputGroupInput type="text" placeholder="HH:MM" {...field} />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* End Time */}
      <FormField
        control={control}
        name="day_end_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End time</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <Clock2Icon className="h-4 w-4 text-gray-500" />
                </InputGroupAddon>
                <InputGroupInput type="text" placeholder="HH:MM" {...field} />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Interval */}
      <FormField
        control={control}
        name="interval"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time slot length (minutes)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="15"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Active */}
      <FormField
        control={control}
        name="is_active"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Active</FormLabel>
            <FormControl>
              <YesNoSwitch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Weekdays */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].map((day) => (
          <FormField
            key={day}
            control={control}
            name={day as keyof ShiftFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{day}</FormLabel>
                <FormControl>
                  <YesNoSwitch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ShiftForm;
