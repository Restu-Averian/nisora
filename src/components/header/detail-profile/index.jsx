import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Camera, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useBreakpoint } from "@/js-toolkit/src/react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80";

function formatJoinDate(createdAt) {
  if (!createdAt) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));
}

const profileSchema = z.object({
  name: z.string().min(1, "Nama lengkap tidak boleh kosong"),
  email: z
    .string()
    ?.trim()
    ?.min(1, "Email tidak boleh kosong")
    ?.pipe(z?.email("Format email tidak valid")),
  avatar: z.instanceof(File).optional(),
});

export default function DetailProfile({ onLogoutSuccess, user }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { xs } = useBreakpoint();

  const metadata = user?.user_metadata ?? {};
  const avatarUrl = metadata.avatar_url ?? metadata.picture ?? DEFAULT_AVATAR;

  const avatarPreview = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }
    return avatarUrl;
  }, [avatarFile, avatarUrl]);

  useEffect(() => {
    if (!avatarPreview || avatarFile) return;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview, avatarFile]);

  const joinedDate = formatJoinDate(user?.created_at);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: metadata.name ?? user?.email?.split("@")?.[0] ?? "",
      email: user?.email ?? "",
      avatar: undefined,
    },
  });

  async function onSubmit(data) {
    setIsSaving(true);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast.error("Sesi berakhir", {
        description: "Silakan login ulang untuk menyimpan perubahan.",
        position: xs ? "top-center" : "top-right",
      });
      setIsSaving(false);
      return;
    }

    let newAvatarUrl = metadata.avatar_url ?? null;

    if (data.avatar) {
      const fileExt = data?.avatar?.name?.split(".").pop();
      const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .bucket("avatars")
        .upload(filePath, data.avatar, { upsert: true });

      if (uploadError) {
        toast.error("Gagal mengunggah foto profil", {
          description: uploadError.message,
          position: xs ? "top-center" : "top-right",
        });
        setIsSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .bucket("avatars")
        .getPublicUrl(filePath);

      newAvatarUrl = urlData?.publicUrl;
    }

    const updatePayload = {
      data: {
        name: data.name.trim(),
        ...(newAvatarUrl ? { avatar_url: newAvatarUrl } : {}),
      },
    };

    const emailChanged = data.email.trim() !== session.user.email;

    if (emailChanged) {
      updatePayload.email = data.email.trim();
    }

    const { error } = await supabase.auth.updateUser(updatePayload);

    if (error) {
      toast.error("Gagal menyimpan perubahan", {
        description: error.message,
        position: xs ? "top-center" : "top-right",
      });
      setIsSaving(false);
      return;
    }

    if (emailChanged) {
      toast.success("Email berhasil diperbarui", {
        description:
          "Kami telah mengirim tautan verifikasi ke email baru kamu. Silakan konfirmasi sebelum perubahan berlaku.",
        position: xs ? "top-center" : "top-right",
        duration: 6000,
      });
    }

    toast.success("Profil berhasil diperbarui", {
      description: "Data kamu sudah tersimpan.",
      position: xs ? "top-center" : "top-right",
    });

    setAvatarFile(null);
    setIsSaving(false);
  }

  const onLogout = async () => {
    setIsLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Gagal keluar dari akun", {
        description: error.message,
        position: xs ? "top-center" : "top-right",
      });
      setIsLoggingOut(false);
      return;
    }

    toast.success("Berhasil logout", {
      description: "Sampai jumpa lagi di Nisora.",
      position: xs ? "top-center" : "top-right",
    });

    onLogoutSuccess?.();
    setIsLoggingOut(false);
  };

  return (
    <section className="w-full max-w-94 px-6 pb-6 pt-8 text-center text-primary-text ">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto mb-5 flex w-fit items-end justify-center">
          <div className="relative">
            <img
              alt="Foto profil pengguna"
              className="size-32 rounded-full border-4 border-background object-cover shadow-[0_0_0_2px_rgba(77,62,44,0.16)]"
              src={avatarPreview}
            />
            <button
              aria-label="Ubah foto profil"
              className="absolute -bottom-1 -right-1 inline-flex size-11 items-center justify-center rounded-full border-2 border-background bg-soft-accent text-primary-text shadow-[0_3px_10px_rgba(77,62,44,0.2)] transition-colors hover:bg-primary-accent hover:text-white"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="size-5" />
            </button>

            <input
              accept="image/*"
              className="sr-only"
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setAvatarFile(file);
                form.setValue("avatar", file);
              }}
            />
          </div>
        </div>

        <h2 className="mb-6 font-heading text-[28px] font-medium leading-none text-[#17131b]">
          Profil Pengguna
        </h2>

        <div className="space-y-5">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-name">Nama Lengkap</FieldLabel>
                <FieldContent>
                  <input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="form-control h-9 text-center"
                    id="profile-name"
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="profile-email">Email</FieldLabel>
                <FieldContent>
                  <input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="form-control h-9 text-center"
                    id="profile-email"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <div className="text-center">
            <p className="text-[15px] leading-tight text-secondary-text">
              Bergabung Sejak (created_at)
            </p>
            <p className="mt-1 text-[16px] leading-tight text-[#17131b]">
              Dibuat pada: {joinedDate}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-6">
          <Button
            className="h-10 w-full rounded-md bg-primary-accent text-[15px] font-bold normal-case tracking-normal text-white shadow-inset-button hover:bg-hover-accent"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? (
              <>
                Menyimpan...
                <Loader2 className="size-4 animate-spin" />
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
          <Button
            className="h-10 w-full rounded-md bg-[#c92121] text-[15px] font-bold normal-case tracking-normal text-white hover:bg-[#a91616]"
            disabled={isLoggingOut}
            type="button"
            onClick={onLogout}
          >
            {isLoggingOut ? (
              <>
                Keluar...
                <Loader2 className="size-4 animate-spin" />
              </>
            ) : (
              "Keluar (Logout)"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
