import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxItem {
  label: string;
  value: string;
}

interface ComboboxProps {
  items: ComboboxItem[];
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  function Combobox(
    { items, value, onChange, placeholder = "Select…", className, disabled },
    ref,
  ) {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[200px] justify-between", className)}
          >
            {value
              ? items.find((item) => item.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange &&
                        onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
