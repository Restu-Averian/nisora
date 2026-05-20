import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProfileActions({ isLoggingOut, isSaving, onLogout }) {
  return (
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
  );
}
