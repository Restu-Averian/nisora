import * as React from "react";
import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const defaultStartYear = 1900;
const defaultFutureYearOffset = 10;

function getDefaultEndYear() {
  return new Date().getFullYear() + defaultFutureYearOffset;
}

function getYearOptions(startYear, endYear) {
  const years = [];

  for (let year = endYear; year >= startYear; year -= 1) {
    years.push(year);
  }

  return years;
}

/**
 * Year-only picker built from existing shadcn-style primitives.
 *
 * @param {Object} props
 * @param {number|string} [props.value]
 * @param {function(number | undefined): void} [props.onChange]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {number} [props.startYear]
 * @param {number} [props.endYear]
 * @returns {React.JSX.Element}
 */
const YearPicker = React.forwardRef(function YearPicker(
  {
    value,
    onChange,
    placeholder = "Pilih tahun",
    disabled = false,
    className,
    startYear = defaultStartYear,
    endYear = getDefaultEndYear(),
    ...props
  },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const selectedButtonRef = React.useRef(null);
  const numericValue = value === "" || value == null ? NaN : Number(value);
  const selectedYear = Number.isInteger(numericValue) ? numericValue : undefined;
  const years = React.useMemo(
    () => getYearOptions(startYear, endYear),
    [startYear, endYear],
  );

  React.useEffect(() => {
    if (open) {
      selectedButtonRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[280px] justify-start text-left font-normal normal-case tracking-normal text-sm",
            !selectedYear && "text-muted-foreground",
            className,
          )}
          {...props}
          type="button"
        >
          <Calendar className="mr-2 size-4" />
          {selectedYear ?? <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-h-72 w-72 overflow-y-auto p-2 overscroll-contain"
        data-vaul-no-drag=""
        portal={false}
      >
        <div className="grid grid-cols-3 gap-1">
          {years.map((year) => (
            <Button
              key={year}
              ref={year === selectedYear ? selectedButtonRef : undefined}
              type="button"
              variant={year === selectedYear ? "default" : "ghost"}
              className="h-9 rounded-sm px-2 text-sm font-medium tracking-normal"
              onClick={() => {
                onChange?.(year);
                setOpen(false);
              }}
            >
              {year}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
});

export { YearPicker };
