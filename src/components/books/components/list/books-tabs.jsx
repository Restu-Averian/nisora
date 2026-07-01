import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "@/data/books";
import { useBreakpoint } from "@/js-toolkit/src/react";
import BookSearch from "./book-search";

const tabsListClassName = "mt-4 flex-1";
const tabsTriggerClassName = "cursor-pointer";

export default function BooksTabs() {
  const { xs } = useBreakpoint();

  return (
    <>
      <div className="books-tabs">
        <TabsList className={tabsListClassName}>
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={tabsTriggerClassName}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {!xs && <BookSearch />}
      </div>

      {xs && <BookSearch />}
    </>
  );
}
