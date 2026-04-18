import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import PickupButton from "./PickupButton";

interface PickupFormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onClear?: () => void;
  label: string;
  id?: string;
  type?: string;
  placeholder?: string;
  title?: string;
  value?: string | object;
  hasError?: boolean;
  error?: string;
  disabled?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  displayKey: string;
}

export function PickupFormInput<T extends FieldValues>({
  control,
  name,
  label,
  title,
  onClear,
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
}: PickupFormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const hasValue = !!field.value || !!value;
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
            <div
              className={cn(
                "flex items-center",
                (error || hasError) && "text-destructive",
              )}
            >
              <Label htmlFor={id || name}>{label}</Label>
            </div>
            <div className="relative flex w-full items-center gap-2">
              <Input
                title={title}
                disabled={disabled}
                id={id || name}
                type={type}
                className={cn(
                  type === "time" &&
                    "appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden",
                  (error || hasError) &&
                    "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
                )}
                placeholder={placeholder}
                value={displayValue}
                readOnly
              />
              {hasValue && !disabled && (
                <button
                  type="button"
                  className="absolute right-14 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    field.onChange(null);
                    onClear?.();
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {!disabled && setOpen && <PickupButton setOpen={setOpen} />}
            </div>
            {(error || hasError) && (
              <p className="text-sm text-destructive">{error || "\u00A0"}</p>
            )}
          </div>
        );
      }}
    />
  );
}

export default PickupFormInput;
