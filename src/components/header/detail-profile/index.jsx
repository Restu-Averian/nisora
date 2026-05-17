import { Camera, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

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

function ProfileField({ id, label, type = "text", value }) {
  return (
    <label className="block text-center">
      <span className="mb-1 block text-[15px] leading-tight text-secondary-text">
        {label}
      </span>
      <span className="relative block">
        <input
          className="h-9 w-full rounded-md border border-border bg-background/70 px-3 pr-10 text-center text-[16px] text-[#17131b] outline-none transition-colors focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/30"
          defaultValue={value}
          id={id}
          key={value}
          type={type}
        />
        <Pencil className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-secondary-text" />
      </span>
    </label>
  );
}

export default function DetailProfile({ user }) {
  const metadata = user?.user_metadata ?? {};
  const fullName =
    metadata.full_name ??
    metadata.name ??
    metadata.display_name ??
    user?.email?.split("@")?.[0] ??
    "-";
  const email = user?.email ?? "-";
  const avatarUrl = metadata.avatar_url ?? metadata.picture ?? DEFAULT_AVATAR;
  const joinedDate = formatJoinDate(user?.created_at);

  return (
    <section className="w-full max-w-94 px-6 pb-6 pt-8 text-center text-primary-text ">
      <div className="mx-auto mb-5 flex w-fit items-end justify-center">
        <div className="relative">
          <img
            alt="Foto profil pengguna"
            className="size-32 rounded-full border-4 border-background object-cover shadow-[0_0_0_2px_rgba(77,62,44,0.16)]"
            src={avatarUrl}
          />
          <button
            aria-label="Ubah foto profil"
            className="absolute -bottom-1 -right-1 inline-flex size-11 items-center justify-center rounded-full border-2 border-background bg-soft-accent text-primary-text shadow-[0_3px_10px_rgba(77,62,44,0.2)] transition-colors hover:bg-primary-accent hover:text-white"
            type="button"
          >
            <Camera className="size-5" />
          </button>
        </div>
      </div>

      <h2 className="mb-6 font-heading text-[28px] font-medium leading-none text-[#17131b]">
        Profil Pengguna
      </h2>

      <form className="space-y-3 text-left">
        <ProfileField
          id="profile-name"
          label="Nama Lengkap"
          value={fullName}
        />
        <ProfileField
          id="profile-email"
          label="Email"
          type="email"
          value={email}
        />

        <div className="text-center">
          <p className="text-[15px] leading-tight text-secondary-text">
            Bergabung Sejak (created_at)
          </p>
          <p className="mt-1 text-[16px] leading-tight text-[#17131b]">
            Dibuat pada: {joinedDate}
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            className="h-10 w-full rounded-md bg-primary-accent text-[15px] font-bold normal-case tracking-normal text-white shadow-inset-button hover:bg-hover-accent"
            type="button"
          >
            Simpan Perubahan
          </Button>
          <Button
            className="h-10 w-full rounded-md bg-[#c92121] text-[15px] font-bold normal-case tracking-normal text-white hover:bg-[#a91616]"
            type="button"
          >
            Keluar (Logout)
          </Button>
        </div>
      </form>
    </section>
  );
}
