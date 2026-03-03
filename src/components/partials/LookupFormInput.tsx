import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Dispatch, SetStateAction } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import LookupButton from "./LookupButton";

interface LookupFormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  id?: string;
  type?: string;
  placeholder?: string;
  title?: string;
  value?: string | object;
  hasError?: boolean;
  error?: string;
  disabled?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  displayKey: string;
}

export function LookupFormInput<T extends FieldValues>({
  control,
  name,
  title,
  id,
  type = "text",
  placeholder,
  value,
  hasError = false,
  error,
  disabled = false,
  className,
  setOpen,
  displayKey,
}: LookupFormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // Decide what to show in the input
        let displayValue = "";
        if (value) {
          if (typeof value === "object" && value !== null) {
            displayValue = (value as any)[displayKey] ?? "";
          } else {
            displayValue = String(value);
          }
        } else if (field.value) {
          if (typeof field.value === "object" && field.value !== null) {
            displayValue = (field.value as any)[displayKey] ?? "";
          } else {
            displayValue = String(field.value);
          }
        }

        return (
          <div className={cn("grid gap-2", className)}>
            <div className="relative flex w-full items-center gap-2">
              <Input
                title={title}
                disabled={disabled}
                id={id || name}
                type={type}
                className={cn(
                  type === "time" &&
                    "appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden"
                )}
                placeholder={placeholder}
                value={displayValue}
                readOnly
              />
              {!disabled && <LookupButton setOpen={setOpen} />}
            </div>
            {hasError && (
              <p className="text-sm text-destructive">{error || "\u00A0"}</p>
            )}
          </div>
        );
      }}
    />
  );
}

export default LookupFormInput;
