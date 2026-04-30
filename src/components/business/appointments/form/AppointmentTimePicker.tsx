import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, Clock2Icon } from "lucide-react";
import { useState } from "react";

interface AppointmentTimePickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  date?: string;
  disabled?: boolean;
  isLoading?: boolean;
  error?: Error | null;
  data?: string[];
  formError?: string;
  onOpen?: () => void;
}

export function AppointmentTimePicker({
  label = "Select a time",
  value,
  isLoading,
  data,
  date,
  disabled,
  error,
  formError,
  onChange,
  onOpen,
}: AppointmentTimePickerProps) {
  const [open, setOpen] = useState(false);
  const times = data ?? [];

  return (
    <div className="grid gap-2">
      <Label className={cn(formError && "text-destructive")}>{label}</Label>

      <Popover
        open={disabled ? false : open}
        onOpenChange={(isOpen) => {
          if (disabled) return;
          setOpen(isOpen);
          if (isOpen) onOpen?.();
        }}
      >
        <PopoverTrigger asChild>
          <div className="relative flex w-full items-center">
            <Clock2Icon className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />

            <Input
              disabled={disabled}
              value={value || "Select a time"}
              readOnly
              aria-invalid={!!formError}
              className="pl-8 pr-8 cursor-pointer"
            />

            <ChevronDownIcon className="pointer-events-none absolute right-2.5 size-4 text-muted-foreground" />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
          <div
            className="flex max-h-72 w-56 flex-col gap-4 overflow-y-auto p-6 md:w-72 lg:w-96"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))
              ) : times.length ? (
                times.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    size="lg"
                    variant={value === time ? "default" : "outline"}
                    className="w-full shadow-none"
                    onClick={() => {
                      onChange?.(time);
                      setOpen(false);
                    }}
                  >
                    {time}
                  </Button>
                ))
              ) : date ? (
                <span className="col-span-full text-sm text-muted-foreground">
                  No available time slots for this date.
                </span>
              ) : !error ? (
                <span className="col-span-full text-sm text-muted-foreground">
                  Please select a date first.
                </span>
              ) : (
                <span className="col-span-full text-sm text-destructive">
                  Failed to load time slots.
                </span>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <FormMessage>{formError}</FormMessage>
    </div>
  );
}
