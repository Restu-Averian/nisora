import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Tabs root container built on Radix Tabs primitive.
 * Manages the active tab state.
 *
 * @component
 * @param {string}  [className]       - Additional Tailwind classes to merge.
 * @param {string}  [value]           - Controlled active tab value.
 * @param {string}  [defaultValue]    - Default active tab value (uncontrolled).
 * @param {(value: string) => void} [onValueChange] - Callback when active tab changes.
 * @param {"horizontal"|"vertical"} [orientation="horizontal"] - Tabs orientation.
 * @param {"automatic"|"manual"} [activationMode="automatic"] - Whether tab activates on focus or click.
 * @param {*} props - Additional Radix Tabs.Root props spread to the root element.
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
 * @param {string}  [className] - Additional Tailwind classes.
 * @param {boolean} [loop]      - When true, keyboard navigation loops from last to first tab.
 * @param {*} props - Additional Radix Tabs.List props.
 * @returns {React.JSX.Element}
 */

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex flex-wrap items-end gap-2 border-b border-border",
        className,
      )}
      {...props}
    />
  );
}

/**
 * TabsTrigger — individual tab button.
 * Wraps Radix Tabs.Trigger.
 *
 * @component
 * @param {string}  [className] - Additional Tailwind classes.
 * @param {string}   value       - The value identifying this trigger (required).
 * @param {boolean} [disabled]  - When true, the trigger cannot be interacted with.
 * @param {*} props - Additional Radix Tabs.Trigger props.
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
 * @param {string}  [className]  - Additional Tailwind classes.
 * @param {string}   value        - The value linking to a TabsTrigger (required).
 * @param {boolean} [forceMount] - Always render content in DOM even when not active.
 * @param {*} props - Additional Radix Tabs.Content props.
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
