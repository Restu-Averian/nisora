import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

/**
 * Dialog root container built on Radix Dialog primitive.
 * Manages open/close state.
 *
 * @component
 * @param {React.ComponentProps<typeof DialogPrimitive.Root>} props
 * @returns {React.JSX.Element}
 *
 * @example
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <DialogContent>...</DialogContent>
 * </Dialog>
 */

function Dialog({ ...props }) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * DialogTrigger — button that opens the dialog when clicked.
 * Wraps Radix Dialog.Trigger.
 *
 * @component
 * @param {React.ComponentProps<typeof DialogPrimitive.Trigger>} props
 * @returns {React.JSX.Element}
 */

function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * DialogPortal — teleports dialog content to a different DOM node.
 * Wraps Radix Dialog.Portal.
 *
 * @component
 * @param {React.ComponentProps<typeof DialogPrimitive.Portal>} props
 * @returns {React.JSX.Element}
 */

function DialogPortal({ ...props }) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * DialogClose — button that closes the dialog when clicked.
 * Wraps Radix Dialog.Close.
 *
 * @component
 * @param {React.ComponentProps<typeof DialogPrimitive.Close>} props
 * @returns {React.JSX.Element}
 */

function DialogClose({ ...props }) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * DialogOverlay — semi-transparent backdrop behind the dialog.
 * Wraps Radix Dialog.Overlay.
 *
 * @component
 * @param {React.ComponentProps<typeof DialogPrimitive.Overlay>} props
 * @returns {React.JSX.Element}
 */

function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-background/20 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * DialogContent — the visible dialog panel with built-in Overlay and close button.
 * Wraps Radix Dialog.Content.
 *
 * @component
 * @param {React.ComponentProps<typeof DialogPrimitive.Content> & {
 *   showCloseButton?: boolean
 * }} props
 * @returns {React.JSX.Element}
 */

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-md bg-popover p-6 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-5 right-5 bg-secondary"
              size="icon-sm"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * DialogHeader — wrapper for the title / description at the top of the dialog panel.
 *
 * @component
 * @param {React.ComponentProps<"div">} props
 * @returns {React.JSX.Element}
 */

function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/**
 * DialogFooter — wrapper for action buttons at the bottom of the dialog panel.
 *
 * @component
 * @param {React.ComponentProps<"div"> & {
 *   showCloseButton?: boolean
 * }} props
 * @returns {React.JSX.Element}
 */

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

/**
 * DialogTitle — heading rendered inside the dialog.
 * Wraps Radix Dialog.Title for accessibility.
 *
 * @component
 * @param {React.ComponentProps<typeof DialogPrimitive.Title>} props
 * @returns {React.JSX.Element}
 */

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-lg leading-none font-semibold tracking-wider uppercase",
        className,
      )}
      {...props}
    />
  );
}

/**
 * DialogDescription — descriptive text rendered inside the dialog.
 * Wraps Radix Dialog.Description for accessibility.
 *
 * @component
 * @param {React.ComponentProps<typeof DialogPrimitive.Description>} props
 * @returns {React.JSX.Element}
 */

function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "mt-0.5 text-sm leading-relaxed text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
