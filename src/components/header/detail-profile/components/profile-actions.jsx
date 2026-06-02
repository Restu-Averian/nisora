import { Loader2 } from "lucide-react";

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
            Menyimpan...
            <Loader2 className="profile-actions__icon" />
          </>
        ) : (
          "Simpan Perubahan"
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
            Keluar...
            <Loader2 className="profile-actions__icon" />
          </>
        ) : (
          "Keluar (Logout)"
        )}
      </Button>
    </div>
  );
}
