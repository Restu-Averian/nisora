import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2, Mail, Send } from "lucide-react";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { useBreakpoint } from "@/js-toolkit/src/react";
import supabase from "@/lib/supabase";

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Please enter a valid email address")),
});

export default function LoginContent({ onSuccess }) {
  const { xs } = useBreakpoint();
  const [authMode, setAuthMode] = useState("sign-in");

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const toastPosition = xs ? "top-center" : "top-right";
  const isSubmitting = form.formState.isSubmitting;

  const isSignIn = authMode === "sign-in";

  const heading = isSignIn ? "Sign in to Nisora" : "Create your Nisora account";
  const description = isSignIn
    ? "Enter your email to receive a secure sign-in link. No password needed."
    : "Enter your email to start your personal reading space. We’ll send you a link to continue.";
  const submitLabel = isSignIn ? "Send sign-in link" : "Continue with email";
  const submittingLabel = isSignIn ? "Sending link..." : "Sending link...";
  const successTitle = isSignIn ? "Sign-in link sent" : "Sign-up link sent";
  // const successDescription = isSignIn
  //   ? `Please check the inbox for ${data?.email ?? ""}.`
  //   : `Please check the inbox for ${data?.email ?? ""}.`;
  const errorTitle = isSignIn
    ? "Failed to send sign-in link"
    : "Failed to send sign-up link";

  const onSubmit = async (data) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: data?.email,
      options: {
        shouldCreateUser: authMode === "sign-up",
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(errorTitle, {
        description: error.message,
        position: toastPosition,
      });

      return;
    }

    toast.success(successTitle, {
      description: `Please check the inbox for ${data.email}.`,
      action: {
        label: "Open email",
        onClick: () => {
          window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
        },
      },
      position: toastPosition,
    });

    form.reset();
    onSuccess?.();
  };

  return (
    <section className="w-full max-w-126 overflow-y-scroll rounded-lg px-8 py-10 text-primary-text md:overflow-y-visible">
      <div className="mx-auto max-w-107.5">
        <header className="mb-7 text-center">
          <div className="mb-5 flex items-center justify-center gap-2">
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isSignIn
                  ? "bg-primary-accent text-white shadow-inset-button"
                  : "bg-transparent text-secondary-text"
              }`}
              onClick={() => setAuthMode("sign-in")}
              type="button"
            >
              Sign in
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !isSignIn
                  ? "bg-primary-accent text-white shadow-inset-button"
                  : "bg-transparent text-secondary-text"
              }`}
              onClick={() => setAuthMode("sign-up")}
              type="button"
            >
              Sign up
            </button>
          </div>

          <h2 className="font-heading text-[28px] font-bold leading-tight text-[#17131b]">
            {heading}
          </h2>
          <p className="mt-3 text-[16px] leading-snug text-[#2f2b33]">
            {description}
          </p>
        </header>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-5">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">Email</FieldLabel>
                  <FieldContent>
                    <span className="relative block">
                      <input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="h-11 w-full rounded-md border border-primary-accent bg-white/70 px-3 pr-11 text-[16px] text-primary-text shadow-[0_0_0_3px_rgba(143,168,199,0.22),0_2px_6px_rgba(77,62,44,0.16)] outline-none placeholder:text-secondary-text focus:border-hover-accent focus:ring-2 focus:ring-primary-accent/40"
                        id="login-email"
                        placeholder="you@email.com"
                        type="email"
                      />
                      <Mail className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-secondary-text" />
                    </span>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            <Button
              className="h-11 w-full rounded-md bg-primary-accent text-[15px] font-bold normal-case tracking-normal text-white shadow-inset-button hover:bg-hover-accent"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  {submittingLabel}
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                <>
                  {submitLabel}
                  <Send className="size-4" />
                </>
              )}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </section>
  );
}
