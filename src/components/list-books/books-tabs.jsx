import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "@/data/books";
import { Button } from "../ui/button";
import { Field, FieldContent } from "../ui/field";
import { Search } from "lucide-react";
import { useBreakpoint } from "@/js-toolkit/src/react";
import InputSearch from "./input-search";

export default function BooksTabs() {
  const { xs } = useBreakpoint();

  return (
    <>
      <div className=" border-b flex justify-between items-end">
        <TabsList className="mt-4 flex-1 ">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="cursor-pointer"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {!xs && <InputSearch />}
      </div>

      {xs && <InputSearch />}
    </>
  );
}
