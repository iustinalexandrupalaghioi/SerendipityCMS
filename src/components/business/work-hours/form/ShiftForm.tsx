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
import SectionCard from "@/components/partials/SectionCard";

interface ShiftFormProps {
  control: Control<ShiftFormValues>;
  mode: "Add" | "Update";
}

const ShiftForm = ({ control, mode }: ShiftFormProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-2 space-y-4">
      {/* ── General ── */}
      <SectionCard title="General">
        <div className="grid grid-cols-1 gap-6">
          {mode === "Update" && (
            <FormField
              control={control}
              name="display_id"
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
        </div>
      </SectionCard>

      {/* ── Schedule ── */}
      <SectionCard title="Schedule">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 place-items-start">
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
                    <InputGroupInput
                      type="text"
                      placeholder="HH:MM"
                      {...field}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <InputGroupInput
                      type="text"
                      placeholder="HH:MM"
                      {...field}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time slot length (min)</FormLabel>
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
        </div>
      </SectionCard>

      {/* ── Working days ── */}
      <SectionCard title="Working days">
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
      </SectionCard>
    </div>
  );
};

export default ShiftForm;
