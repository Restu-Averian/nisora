import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * AlertDialog root container built on Radix AlertDialog primitive.
 * Manages confirmation dialog open state.
 *
 * @component
 * @param {React.ComponentProps<typeof AlertDialogPrimitive.Root>} props
 * @returns {React.JSX.Element}
 */
function AlertDialog({ ...props }) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

/**
 * AlertDialogTrigger — element that opens the confirmation dialog.
 * Wraps Radix AlertDialog.Trigger.
 *
 * @component
 * @param {React.ComponentProps<typeof AlertDialogPrimitive.Trigger>} props
 * @returns {React.JSX.Element}
 */
function AlertDialogTrigger({ ...props }) {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      {...props}
    />
  );
}

/**
 * AlertDialogPortal — teleports alert dialog content to a portal.
 * Wraps Radix AlertDialog.Portal.
 *
 * @component
 * @param {React.ComponentProps<typeof AlertDialogPrimitive.Portal>} props
 * @returns {React.JSX.Element}
 */
function AlertDialogPortal({ ...props }) {
  return (
    <AlertDialogPrimitive.Portal
      data-slot="alert-dialog-portal"
      {...props}
    />
  );
}

/**
 * AlertDialogOverlay — backdrop behind the confirmation dialog.
 * Wraps Radix AlertDialog.Overlay.
 *
 * @component
 * @param {React.ComponentProps<typeof AlertDialogPrimitive.Overlay>} props
 * @returns {React.JSX.Element}
 */
function AlertDialogOverlay({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-background/20 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogContent — visible confirmation dialog panel.
 * Wraps Radix AlertDialog.Content with the app dialog theme.
 *
 * @component
 * @param {React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
 *   size?: "default" | "sm"
 * }} props
 * @returns {React.JSX.Element}
 */
function AlertDialogContent({ className, size = "default", ...props }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-md bg-popover p-6 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[size=sm]:sm:max-w-sm data-[size=default]:sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

/**
 * AlertDialogHeader — wrapper for confirmation title and description.
 *
 * @component
 * @param {React.ComponentProps<"div">} props
 * @returns {React.JSX.Element}
 */
function AlertDialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid gap-2 text-center has-data-[slot=alert-dialog-media]:grid-cols-[auto_1fr] has-data-[slot=alert-dialog-media]:items-start has-data-[slot=alert-dialog-media]:text-left sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogFooter — wrapper for confirmation actions.
 *
 * @component
 * @param {React.ComponentProps<"div">} props
 * @returns {React.JSX.Element}
 */
function AlertDialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogMedia — optional visual slot for alert icons or media.
 *
 * @component
 * @param {React.ComponentProps<"div">} props
 * @returns {React.JSX.Element}
 */
function AlertDialogMedia({ className, ...props }) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md bg-destructive/10 text-destructive *:[svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogTitle — accessible title for the confirmation dialog.
 * Wraps Radix AlertDialog.Title.
 *
 * @component
 * @param {React.ComponentProps<typeof AlertDialogPrimitive.Title>} props
 * @returns {React.JSX.Element}
 */
function AlertDialogTitle({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "font-heading text-lg font-bold leading-tight text-primary-text",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogDescription — supporting text for the confirmation dialog.
 * Wraps Radix AlertDialog.Description.
 *
 * @component
 * @param {React.ComponentProps<typeof AlertDialogPrimitive.Description>} props
 * @returns {React.JSX.Element}
 */
function AlertDialogDescription({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-sm leading-relaxed text-secondary-text",
        className,
      )}
      {...props}
    />
  );
}

/**
 * AlertDialogAction — primary action button that confirms the dialog.
 * Wraps Radix AlertDialog.Action with the app Button component.
 *
 * @component
 * @param {React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
 *   variant?: React.ComponentProps<typeof Button>["variant"],
 *   size?: React.ComponentProps<typeof Button>["size"]
 * }} props
 * @returns {React.JSX.Element}
 */
function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  );
}

/**
 * AlertDialogCancel — secondary action button that dismisses the dialog.
 * Wraps Radix AlertDialog.Cancel with the app Button component.
 *
 * @component
 * @param {React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & {
 *   variant?: React.ComponentProps<typeof Button>["variant"],
 *   size?: React.ComponentProps<typeof Button>["size"]
 * }} props
 * @returns {React.JSX.Element}
 */
function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        data-slot="alert-dialog-cancel"
        className={cn(className)}
        {...props}
      />
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
