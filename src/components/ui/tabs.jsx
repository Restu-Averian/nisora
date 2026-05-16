import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Tabs root container built on Radix Tabs primitive.
 * Manages the active tab state.
 *
 * @component
 * @param {React.ComponentProps<typeof TabsPrimitive.Root>} props
 * @returns {React.JSX.Element}
 *
 * @example
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 */

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-5", className)}
      {...props}
    />
  );
}

/**
 * TabsList — container for TabsTrigger items.
 * Wraps Radix Tabs.List.
 *
 * @component
 * @param {React.ComponentProps<typeof TabsPrimitive.List>} props
 * @returns {React.JSX.Element}
 */

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("flex flex-wrap items-end gap-2 border-border", className)}
      {...props}
    />
  );
}

/**
 * TabsTrigger — individual tab button.
 * Wraps Radix Tabs.Trigger.
 *
 * @component
 * @param {React.ComponentProps<typeof TabsPrimitive.Trigger>} props
 * @returns {React.JSX.Element}
 */

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "h-9 rounded-t-md px-4 text-sm font-semibold text-primary-text transition-colors hover:bg-surface data-[state=active]:bg-soft-accent data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/**
 * TabsContent — panel shown when its matching tab is active.
 * Wraps Radix Tabs.Content.
 *
 * @component
 * @param {React.ComponentProps<typeof TabsPrimitive.Content>} props
 * @returns {React.JSX.Element}
 */

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
