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
    .min(1, "Email wajib diisi")
    .pipe(z.email("Alamat email tidak valid")),
});

export default function LoginContent({ onSuccess }) {
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
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error("Gagal mengirim tautan masuk", {
        description: error.message,
        position: toastPosition,
      });

      return;
    }

    toast.success("Tautan masuk terkirim", {
      description: `Silakan cek inbox ${data.email}.`,
      action: {
        label: "Buka Email",
        onClick: () => {
          window.location.href = "mailto:";
        },
      },
      position: toastPosition,
    });

    form.reset();
    onSuccess?.();
  };

  return (
    <section className="w-full max-w-126 rounded-lg px-8 py-10 text-primary-text overflow-y-scroll md:overflow-y-visible">
      <div className="mx-auto max-w-107.5">
        <header className="mb-7 text-center">
          <h2 className="font-heading text-[28px] font-bold leading-tight text-[#17131b]">
            Masuk Aman Tanpa Kata Sandi
          </h2>
          <p className="mt-3 text-[16px] leading-snug text-[#2f2b33]">
            Gunakan login cepat kami. Masukkan email Anda untuk menerima tautan
            masuk aman langsung ke kotak masuk Anda. Tidak perlu kata sandi!
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
                        placeholder="anda@email.com"
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
                  Mengirim Tautan...
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                <>
                  Kirim Tautan Masuk ke Email
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
