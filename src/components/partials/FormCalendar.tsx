"use client";

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

interface FormCalendarProps {
  label: string;
  value?: string; // ISO: yyyy-MM-dd
  onChange: (value: string) => void;
  disabled?: boolean;
  startMonth?: Date;
}

export const FormCalendar: React.FC<FormCalendarProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  startMonth,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const MAX_YEARS_AHEAD = 5;
  const toDate = new Date(today);
  toDate.setFullYear(today.getFullYear() + MAX_YEARS_AHEAD);

  const effectiveStartMonth = startMonth ?? today;

  const [open, setOpen] = React.useState(false);

  const selectedDate = value ? parseISO(value) : undefined;

  const handleSelect = (date?: Date) => {
    if (!date || !isValid(date)) return;

    onChange(format(date, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <FormItem className="flex flex-col">
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
                ? format(selectedDate, "dd-MM-yyyy") // 👀 DISPLAY ONLY
                : "Select date"}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </FormControl>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            startMonth={effectiveStartMonth}
            endMonth={toDate}
            disabled={{ before: effectiveStartMonth }}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>

      <FormMessage />
    </FormItem>
  );
};
