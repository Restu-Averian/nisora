import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";

export function FormActions({ isSubmitting, onCancel }) {
  return (
    <div className="flex items-center gap-4 pt-1">
      <Button
        className="h-8 flex-1 rounded-md bg-primary-accent text-xs font-semibold normal-case tracking-normal text-white hover:bg-hover-accent"
        disabled={isSubmitting}
        type="submit"
      >
        <Plus className="size-4" />
        {isSubmitting ? "Menambahkan..." : "Tambah Buku"}
      </Button>
      <DrawerClose asChild>
        <button
          className="h-8 px-2 text-13 font-medium text-secondary-text transition-colors hover:text-primary-text"
          disabled={isSubmitting}
          type="button"
          onClick={onCancel}
        >
          Batal
        </button>
      </DrawerClose>
    </div>
  );
}
