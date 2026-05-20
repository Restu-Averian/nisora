import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useBreakpoint } from "@/js-toolkit/src/react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import ProfileActions from "./components/ProfileActions";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileField from "./components/ProfileField";
import ProfileJoinedDate from "./components/ProfileJoinedDate";
import {
  createAvatarPath,
  formatJoinDate,
  getAvatarUrl,
  getProfileDefaultValues,
  profileSchema,
} from "./utils/profile";

export default function DetailProfile({ onLogoutSuccess, user }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { xs } = useBreakpoint();

  const metadata = user?.user_metadata ?? {};
  const avatarUrl = getAvatarUrl(metadata);

  const avatarPreview = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }
    return avatarUrl;
  }, [avatarFile, avatarUrl]);

  const joinedDate = formatJoinDate(user?.created_at);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: getProfileDefaultValues({ metadata, user }),
  });

  const toastPosition = useMemo(() => (xs ? "top-center" : "top-right"), [xs]);

  const onAvatarChange = (file) => {
    setAvatarFile(file);
    form.setValue("avatar", file);
  };

  async function onSubmit(data) {
    setIsSaving(true);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast.error("Sesi berakhir", {
        description: "Silakan login ulang untuk menyimpan perubahan.",
        position: toastPosition,
      });
      setIsSaving(false);
      return;
    }

    let newAvatarUrl = metadata.avatar_url ?? null;

    if (data.avatar) {
      const filePath = createAvatarPath({
        file: data.avatar,
        userId: session.user.id,
      });

      const { error: uploadError, data: dataUploaded } = await supabase.storage
        .from("avatars")
        .upload(filePath, data.avatar, { upsert: true });

      if (uploadError) {
        toast.error("Gagal mengunggah foto profil", {
          description: uploadError.message,
          position: toastPosition,
        });
        setIsSaving(false);
        return;
      }

      const { data: dataSignedURL } = await supabase.storage
        .from("avatars")
        .createSignedUrl(dataUploaded?.path, 60 * 60);

      newAvatarUrl = dataSignedURL?.signedUrl;
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
        position: toastPosition,
      });
      setIsSaving(false);
      return;
    }

    if (emailChanged) {
      toast.success("Email berhasil diperbarui", {
        description:
          "Kami telah mengirim tautan verifikasi ke email baru kamu. Silakan konfirmasi sebelum perubahan berlaku.",
        position: toastPosition,
        duration: 6000,
      });
    }

    toast.success("Profil berhasil diperbarui", {
      description: "Data kamu sudah tersimpan.",
      position: toastPosition,
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
        position: toastPosition,
      });
      setIsLoggingOut(false);
      return;
    }

    toast.success("Berhasil logout", {
      description: "Sampai jumpa lagi di Nisora.",
      position: toastPosition,
    });

    onLogoutSuccess?.();
    setIsLoggingOut(false);
  };

  useEffect(() => {
    if (!avatarPreview || avatarFile) return;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview, avatarFile]);

  return (
    <section className="w-full max-w-94 px-6 pb-6 pt-8 text-center text-primary-text ">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ProfileAvatar
          avatarPreview={avatarPreview}
          fileInputRef={fileInputRef}
          onAvatarChange={onAvatarChange}
        />

        <h2 className="mb-6 font-heading text-[28px] font-medium leading-none text-[#17131b]">
          Profil Pengguna
        </h2>

        <div className="space-y-5">
          <ProfileField
            control={form.control}
            id="profile-name"
            label="Nama Lengkap"
            name="name"
            type="text"
          />

          <ProfileField
            control={form.control}
            id="profile-email"
            label="Email"
            name="email"
            type="email"
          />

          <ProfileJoinedDate joinedDate={joinedDate} />
        </div>

        <ProfileActions
          isLoggingOut={isLoggingOut}
          isSaving={isSaving}
          onLogout={onLogout}
        />
      </form>
    </section>
  );
}
