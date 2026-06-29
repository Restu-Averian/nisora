import { LoaderCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";

export function FormActions({ isSubmitting, onCancel }) {
  return (
    <div className="book-actions">
      <Button
        className="book-actions__submit"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <LoaderCircle className="book-actions__icon book-actions__icon--loading" />
        ) : (
          <Plus className="book-actions__icon" />
        )}

        {isSubmitting ? "Menambahkan..." : "Tambah Buku"}
      </Button>

      <DrawerClose asChild>
        <button
          className="book-actions__cancel"
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
