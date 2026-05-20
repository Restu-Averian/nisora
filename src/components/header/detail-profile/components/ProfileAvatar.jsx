import { Camera } from "lucide-react";

export default function ProfileAvatar({
  avatarPreview,
  fileInputRef,
  onAvatarChange,
}) {
  return (
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
            onAvatarChange(file);
          }}
        />
      </div>
    </div>
  );
}
