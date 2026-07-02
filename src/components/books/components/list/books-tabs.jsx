import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "@/data/books";
import { BookOpen, CircleCheck, LayoutGrid } from "lucide-react";

const tabsListClassName =
  "grid w-full grid-cols-1 gap-1 rounded-xl border border-border bg-background/75 p-1 shadow-[0_6px_18px_rgba(70,55,35,0.08)] sm:grid-cols-3 xl:w-auto";
const tabsTriggerClassName =
  "flex h-12 min-w-0 cursor-pointer items-center justify-center gap-3 rounded-lg px-4 text-[15px] font-semibold normal-case tracking-normal text-primary-text hover:bg-soft-accent/70 data-[state=active]:bg-primary-accent data-[state=active]:text-white data-[state=active]:shadow-inset-button sm:min-w-45";
const tabsIconClassName = "size-5 shrink-0";
const TAB_ICONS = {
  all: LayoutGrid,
  reading: BookOpen,
  finished: CircleCheck,
};

export default function BooksTabs() {
  return (
    <TabsList className={tabsListClassName}>
      {TABS.map((tab) => {
        const Icon = TAB_ICONS[tab.value] ?? LayoutGrid;

        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={tabsTriggerClassName}
          >
            <Icon className={tabsIconClassName} />
            <span>{tab.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
