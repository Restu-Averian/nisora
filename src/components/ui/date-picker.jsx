import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * Reusable DatePicker component built with Radix Popover and DayPicker Calendar.
 *
 * @component
 * @param {Object} props
 * @param {Date} [props.value] - The currently selected date
 * @param {function(Date | undefined): void} [props.onChange] - Callback when date is selected or cleared
 * @param {string} [props.placeholder="Pilih tanggal"] - Placeholder text when no date is selected
 * @param {boolean} [props.disabled=false] - Disable the date picker button
 * @param {string} [props.className] - Additional classes for the trigger button
 * @returns {React.JSX.Element}
 *
 * @example
 * <DatePicker value={date} onChange={setDate} />
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  disabled = false,
  className,
  ...props
}) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = isValidDate(value) ? value : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[280px] justify-start text-left font-normal normal-case tracking-normal text-sm",
            !selectedDate && "text-muted-foreground",
            className
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 size-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
