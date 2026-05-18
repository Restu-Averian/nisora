import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";

/**
 * Toaster component built on sonner.
 * Renders themed toast notifications with custom icons.
 *
 * @component
 * @param {React.ComponentProps<typeof Sonner>} props
 * @returns {React.JSX.Element}
 *
 * @example
 * <Toaster />
 *
 * @example
 * <Toaster position="top-right" richColors />
 */

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group text-red-600"
      icons={{
        success: <CircleCheckIcon className="size-4 text-primary-accent" />,
        info: <InfoIcon className="size-4 text-primary-accent" />,
        warning: <TriangleAlertIcon className="size-4 text-[#9a6a20]" />,
        error: <OctagonXIcon className="size-4 text-[#c92121]" />,
        loading: (
          <Loader2Icon className="size-4 animate-spin text-primary-accent" />
        ),
      }}
      style={{
        "--normal-bg": "rgb(250 246 240 / 0.98)",
        "--normal-text": "var(--primary-text)",
        "--normal-border": "#d6cbbd",
        "--border-radius": "0.75rem",
      }}
      toastOptions={{
        classNames: {
          toast:
            "cn-toast border border-[#d6cbbd] bg-background/98 text-primary-text shadow-[0_12px_32px_rgba(77,62,44,0.18)] backdrop-blur-sm [&_[data-description]]:!text-[#5f5966] [&_[data-description]]:!opacity-100 [&_[data-description]]:!font-medium [&_[data-description]]:!leading-snug [&_[data-title]]:!text-primary-text [&_[data-title]]:!font-bold",
          title: "text-[15px] font-bold leading-tight text-primary-text",
          description:
            "!text-[#5f5966] !opacity-100 text-[14px] font-medium leading-snug",
          actionButton:
            "rounded-md bg-primary-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-hover-accent",
          cancelButton:
            "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-bold text-primary-text hover:bg-soft-accent",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
