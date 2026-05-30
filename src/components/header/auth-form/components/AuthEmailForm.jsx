import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2, Mail, Send } from "lucide-react";
import { z } from "zod";
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

export default function AuthEmailForm({
  heading,
  description,
  submitLabel,
  successTitle,
  errorTitle,
  shouldCreateUser,
  emailInputId,
  footer,
  onSuccess,
}) {
  const { xs } = useBreakpoint();

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

  const onSubmit = async (data) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: data?.email,
      options: {
        shouldCreateUser,
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
    <section className="auth-form md:overflow-y-visible">
      <div className="auth-form__inner">
        <header className="auth-form__header">
          <h2 className="auth-form__title">{heading}</h2>
          <p className="auth-form__description">{description}</p>
        </header>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="auth-form__field-group">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field
                  className="auth-form__field"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor={emailInputId}>Email</FieldLabel>
                  <FieldContent>
                    <span className="auth-form__input-wrap">
                      <input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="auth-form__input"
                        id={emailInputId}
                        placeholder="you@email.com"
                        type="email"
                      />
                      <Mail className="auth-form__input-icon" />
                    </span>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            <Button
              className="auth-form__submit"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  Sending link...
                  <Loader2 className="auth-form__submit-icon auth-form__submit-icon--loading" />
                </>
              ) : (
                <>
                  {submitLabel}
                  <Send className="auth-form__submit-icon" />
                </>
              )}
            </Button>
          </FieldGroup>
        </form>

        {footer}
      </div>
    </section>
  );
}
