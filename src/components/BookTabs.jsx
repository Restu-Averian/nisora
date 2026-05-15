import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "@/data/books";

export function BookTabs() {
  return (
    <TabsList className="mt-4">
      {TABS.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
