import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "@/data/books";
import { useBreakpoint } from "@/js-toolkit/src/react";
import BookSearch from "./book-search";

export default function BooksTabs() {
  const { xs } = useBreakpoint();

  return (
    <>
      <div className="books-tabs">
        <TabsList className="books-tabs__list">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="books-tabs__trigger"
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
