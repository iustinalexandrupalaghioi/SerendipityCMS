import { useMemo, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  intervalMinutes?: number;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  intervalMinutes = 15,
}) => {
  const [open, setOpen] = useState(false);

  const times = useMemo(() => {
    const interval = Number(intervalMinutes) || 15; // force number
    return Array.from({ length: Math.ceil((24 * 60) / interval) }, (_, i) => {
      const totalMinutes = i * interval;
      const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
      const minutes = String(totalMinutes % 60).padStart(2, "0");
      return `${hours}:${minutes}`;
    });
  }, [intervalMinutes]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[140px] justify-between text-sm flex items-center gap-2"
        >
          <span>{value || "Select time"}</span>
          <Clock className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-40 p-0">
        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
          {times.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                onChange(t);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left transition rounded-md 
                ${
                  t === value
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
