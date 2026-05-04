import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AppointmentDatePickerProps {
  label: string;
  value?: string; // ISO: yyyy-MM-dd
  onChange?: (value: string) => void;
  disabled?: boolean;
  unavailableDates?: string[]; // ✅ ISO dates from API
  error?: string;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const MAX_YEARS_AHEAD = 5;
const toDate = new Date(today);
toDate.setFullYear(today.getFullYear() + MAX_YEARS_AHEAD);

export const AppointmentDatePicker: React.FC<AppointmentDatePickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  unavailableDates = [],
  error,
}) => {
  const [open, setOpen] = React.useState(false);

  // Selected date from form value
  const selectedDate = value ? parseISO(value) : undefined;

  // Normalize unavailable dates ONCE
  const unavailableDateObjects = React.useMemo(() => {
    return unavailableDates
      .map((d) => {
        const parsed = parseISO(d);
        if (!isValid(parsed)) return null;
        parsed.setHours(0, 0, 0, 0);
        return parsed;
      })
      .filter(Boolean) as Date[];
  }, [unavailableDates]);

  const handleSelect = (date?: Date) => {
    if (!date || !isValid(date)) return;

    onChange?.(format(date, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <FormItem className="flex flex-col w-full">
      <FormLabel>{label}</FormLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className="justify-between font-normal"
            >
              {selectedDate && isValid(selectedDate)
                ? format(selectedDate, "dd-MM-yyyy")
                : "dd-MM-yyyy"}
              <ChevronDownIcon className="-ml-1 h-4 w-4" />
            </Button>
          </FormControl>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            startMonth={selectedDate ?? today}
            endMonth={toDate}
            captionLayout="dropdown"
            onSelect={handleSelect}
            disabled={(date) => {
              const isPastOrToday = date <= today;

              const isUnavailable = unavailableDateObjects.some(
                (d) => d.getTime() === date.getTime(),
              );

              return isPastOrToday || isUnavailable;
            }}
            modifiers={{
              unavailable: unavailableDateObjects,
            }}
            modifiersClassNames={{
              unavailable: "[&>button]:line-through opacity-100",
            }}
          />
        </PopoverContent>
      </Popover>

      <FormMessage>{error}</FormMessage>
    </FormItem>
  );
};
