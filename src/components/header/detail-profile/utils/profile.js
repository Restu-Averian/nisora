import { z } from "zod";

export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80";

export const profileSchema = z.object({
  name: z.string().min(1, "Nama lengkap tidak boleh kosong"),
  email: z
    .string()
    ?.trim()
    ?.min(1, "Email tidak boleh kosong")
    ?.pipe(z?.email("Format email tidak valid")),
  avatar: z.instanceof(File).optional(),
});

export function formatJoinDate(createdAt) {
  if (!createdAt) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));
}

export function getAvatarUrl(metadata) {
  return metadata.avatar_url ?? metadata.picture ?? DEFAULT_AVATAR;
}

export function getProfileDefaultValues({ metadata, user }) {
  return {
    name: metadata.name ?? user?.email?.split("@")?.[0] ?? "",
    email: user?.email ?? "",
    avatar: undefined,
  };
}

export function createAvatarPath({ file, userId }) {
  const fileExt = file?.name?.split(".").pop();

  return `${userId}/${Date.now()}.${fileExt}`;
}
