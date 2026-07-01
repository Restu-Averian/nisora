import { Loader2, Bookmark, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProfileActions({ isLoggingOut, isSaving, onLogout }) {
  return (
    <div className="profile-actions">
      <Button
        className="profile-actions__submit"
        disabled={isSaving}
        type="submit"
      >
        {isSaving ? (
          <>
            <Loader2 className="profile-actions__icon" />
            Menyimpan...
          </>
        ) : (
          <>
            <Bookmark className="profile-actions__icon profile-actions__icon--static" />
            Simpan Perubahan
          </>
        )}
      </Button>
      <Button
        className="profile-actions__logout"
        disabled={isLoggingOut}
        type="button"
        onClick={onLogout}
        variant="destructive"
      >
        {isLoggingOut ? (
          <>
            <Loader2 className="profile-actions__icon" />
            Keluar...
          </>
        ) : (
          <>
            <LogOut className="profile-actions__icon profile-actions__icon--static" />
            Keluar (Logout)
          </>
        )}
      </Button>
    </div>
  );
}
