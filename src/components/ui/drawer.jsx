import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

/**
 * Drawer root — Vaul drawer container.
 * Manages open state, direction, snap points, and gesture behavior.
 *
 * @component
 * @param {boolean}  [open]                  - Controlled open state.
 * @param {(open: boolean) => void} [onOpenChange] - Callback when open state changes.
 * @param {"bottom"|"top"|"left"|"right"} [direction="bottom"] - Drawer entrance direction.
 * @param {boolean}  [modal=true]            - When true, interaction with rest of page is blocked.
 * @param {string[]|number[]} [snapPoints]   - Snap positions as percentages or pixels.
 * @param {boolean}  [dismissible=true]      - When true, can be dismissed via backdrop press / escape.
 * @param {boolean}  [noBodyStyles=false]    - Prevents Vaul from setting body styles.
 * @param {boolean}  [shouldScaleBackground] - Scales the background when drawer opens.
 * @param {boolean}  [nested]                - When true, renders as a nested drawer.
 * @param {*} props - Additional Vaul Drawer.Root props.
 * @returns {React.JSX.Element}
 *
 * @see https://github.com/emilkowalski/vaul
 */

function Drawer({
  ...props
}) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

/**
 * DrawerTrigger — button that opens the drawer when clicked.
 * Wraps Vaul Drawer.Trigger.
 *
 * @component
 * @param {boolean} [asChild] - When true, renders children via Radix Slot instead of a `<button>`.
 * @param {*} props - Additional Vaul Drawer.Trigger props.
 * @returns {React.JSX.Element}
 */

function DrawerTrigger({
  ...props
}) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

/**
 * DrawerPortal — teleports drawer content to a different DOM node.
 * Wraps Vaul Drawer.Portal.
 *
 * @component
 * @param {HTMLElement} [container] - DOM element to portal into (defaults to document.body).
 * @param {boolean}     [forceMount] - Always mount children in DOM.
 * @param {*} props - Additional Vaul Drawer.Portal props.
 * @returns {React.JSX.Element}
 */

function DrawerPortal({
  ...props
}) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

/**
 * DrawerClose — button that closes the drawer when clicked.
 * Wraps Vaul Drawer.Close.
 *
 * @component
 * @param {boolean} [asChild] - When true, renders children via Radix Slot instead of a `<button>`.
 * @param {*} props - Additional Vaul Drawer.Close props.
 * @returns {React.JSX.Element}
 */

function DrawerClose({
  ...props
}) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

/**
 * DrawerOverlay — semi-transparent backdrop behind the drawer.
 * Wraps Vaul Drawer.Overlay.
 *
 * @component
 * @param {string}  [className]  - Additional Tailwind classes.
 * @param {boolean} [forceMount] - Always mount in DOM.
 * @param {*} props - Additional Vaul Drawer.Overlay props.
 * @returns {React.JSX.Element}
 */

function DrawerOverlay({
  className,
  ...props
}) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props} />
  );
}

/**
 * DrawerContent — the visible drawer panel with built-in Overlay and handle bar.
 * Wraps Vaul Drawer.Content.
 *
 * @component
 * @param {string}  [className]  - Additional Tailwind classes.
 * @param {*} [children] - Content rendered inside the drawer panel.
 * @param {boolean} [forceMount] - Always mount in DOM.
 * @param {*} props - Additional Vaul Drawer.Content props.
 * @returns {React.JSX.Element}
 */

function DrawerContent({
  className,
  children,
  ...props
}) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-none data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-none data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-none data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm",
          className
        )}
        {...props}>
        <div
          className="mx-auto mt-4 hidden h-1.5 w-[100px] shrink-0 rounded-none bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

/**
 * DrawerHeader — wrapper for the title / description at the top of the drawer panel.
 * Text is centered for bottom/top drawers on mobile, left-aligned on desktop.
 *
 * @component
 * @param {string} [className] - Additional Tailwind classes.
 * @param {*} props - Native `<div>` attributes.
 * @returns {React.JSX.Element}
 */

function DrawerHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-1 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-2 md:text-left",
        className
      )}
      {...props} />
  );
}

/**
 * DrawerFooter — wrapper for action buttons at the bottom of the drawer panel.
 *
 * @component
 * @param {string} [className] - Additional Tailwind classes.
 * @param {*} props - Native `<div>` attributes.
 * @returns {React.JSX.Element}
 */

function DrawerFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props} />
  );
}

/**
 * DrawerTitle — heading rendered inside the drawer.
 * Wraps Vaul Drawer.Title for accessibility.
 *
 * @component
 * @param {string} [className] - Additional Tailwind classes.
 * @param {*} props - Additional Vaul Drawer.Title props.
 * @returns {React.JSX.Element}
 */

function DrawerTitle({
  className,
  ...props
}) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "font-heading text-lg font-semibold tracking-wider text-foreground uppercase",
        className
      )}
      {...props} />
  );
}

/**
 * DrawerDescription — descriptive text rendered inside the drawer.
 * Wraps Vaul Drawer.Description for accessibility.
 *
 * @component
 * @param {string} [className] - Additional Tailwind classes.
 * @param {*} props - Additional Vaul Drawer.Description props.
 * @returns {React.JSX.Element}
 */

function DrawerDescription({
  className,
  ...props
}) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("mt-0.5 text-sm leading-relaxed text-muted-foreground", className)}
      {...props} />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
