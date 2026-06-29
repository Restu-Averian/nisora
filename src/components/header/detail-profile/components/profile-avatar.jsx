import { Camera } from "lucide-react";

export default function ProfileAvatar({
  avatarPreview,
  fileInputRef,
  onAvatarChange,
}) {
  return (
    <div className="profile-avatar">
      <div className="profile-avatar__frame">
        <img
          alt="Foto profil pengguna"
          className="profile-avatar__image"
          src={avatarPreview}
          loading="lazy"
        />

        <button
          aria-label="Ubah foto profil"
          className="profile-avatar__button"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="profile-avatar__icon" />
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
