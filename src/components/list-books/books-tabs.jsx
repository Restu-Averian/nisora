import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "@/data/books";
import { Button } from "../ui/button";
import { Field, FieldContent } from "../ui/field";
import { Search } from "lucide-react";
import { useBreakpoint } from "@/js-toolkit/src/react";

export default function BooksTabs() {
  const { xs } = useBreakpoint();

  return (
    <>
      <div className=" border-b flex justify-between items-end">
        <TabsList className="mt-4 flex-1">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {!xs && (
          <Field className="gap-1.5 flex-1 ">
            <FieldContent className="relative ml-auto" style={{ width: 360 }}>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                className="form-control h-8 pl-9 ml-auto "
                id="search-book"
                placeholder="Cari Koleksi"
                type="text"
              />
            </FieldContent>
          </Field>
        )}
      </div>

      {xs && (
        <Field className="gap-1.5 flex-1 ">
          <FieldContent className="relative ml-auto">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              className="form-control h-8 pl-9 ml-auto "
              id="search-book"
              placeholder="Cari Koleksi"
              type="text"
            />
          </FieldContent>
        </Field>
      )}
    </>
  );
}
