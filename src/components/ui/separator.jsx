"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Separator component built on Radix Separator primitive.
 * Renders an accessible horizontal or vertical divider.
 *
 * @component
 * @param {string}                [className]         - Additional Tailwind classes to merge.
 * @param {"horizontal"|"vertical"} [orientation="horizontal"] - Axis of the separator.
 * @param {boolean}               [decorative=true]   - When true, hides from accessibility tree.
 * @param {*} props - Additional props (id, aria attributes, etc.) spread to the Radix Separator.Root element.
 * @returns {React.JSX.Element}
 *
 * @example
 * <Separator />
 *
 * @example
 * <Separator orientation="vertical" className="mx-2 h-8" />
 */

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
