import * as React from "react";
import { Calendar, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchInputRef = React.useRef(null);
  const selectedButtonRef = React.useRef(null);
  const numericValue = value === "" || value == null ? NaN : Number(value);
  const selectedYear = Number.isInteger(numericValue) ? numericValue : undefined;
  const years = React.useMemo(
    () => getYearOptions(startYear, endYear),
    [startYear, endYear],
  );
  const filteredYears = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      return years;
    }

    return years.filter((year) => String(year).includes(normalizedQuery));
  }, [searchQuery, years]);

  const handleOpenChange = React.useCallback((nextOpen) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearchQuery("");
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      searchInputRef.current?.focus();
      selectedButtonRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
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
        className="w-72 p-2"
        data-vaul-no-drag=""
        portal={false}
      >
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            inputMode="numeric"
            placeholder="Cari tahun"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 px-8 text-sm"
          />
        </div>
        <div className="max-h-60 overflow-y-auto overscroll-contain">
          {filteredYears.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {filteredYears.map((year) => (
                <Button
                  key={year}
                  ref={year === selectedYear ? selectedButtonRef : undefined}
                  type="button"
                  variant={year === selectedYear ? "default" : "ghost"}
                  className="h-9 rounded-sm px-2 text-sm font-medium tracking-normal"
                  onClick={() => {
                    onChange?.(year);
                    handleOpenChange(false);
                  }}
                >
                  {year}
                </Button>
              ))}
            </div>
          ) : (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              Tahun tidak ditemukan
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});

export { YearPicker };
