import { useEffect, useMemo, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TABS } from "@/data/books";
import useBooksStore from "@/store/booksStore";
import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import EditBookForm from "./edit-book-form";

export default function BookDetail({ book }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteBook = useBooksStore(
    useShallow((state) => {
      return state.deleteBook;
    }),
  );
  const statusText = useMemo(() => {
    return TABS.find((tab) => tab.value === currentBook?.status)?.label ?? "-";
  }, [currentBook?.status]);

  async function onDelete() {
    setIsDeleting(true);

    const { error } = await deleteBook({ bookId: currentBook.id });

    if (error) {
      toast.error("Gagal menghapus buku", {
        description: error.message,
      });
      setIsDeleting(false);
      return;
    }

    toast.success("Buku berhasil dihapus");
    setCurrentBook(null);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  }

  useEffect(() => {
    setCurrentBook(book);
    setIsEditing(false);
  }, [book]);

  if (!currentBook) {
    return null;
  }

  return (
    <section className="book-detail md:overflow-y-visible">
      <div
        className={`book-detail__layout md:p-8 ${
          isEditing ? "" : "md:grid-cols-[330px_1fr]"
        }`}
      >
        {!isEditing && (
          <img
            alt={`Sampul ${currentBook.title}`}
            className="book-detail__cover"
            src={currentBook.cover}
          />
        )}

        <div className="book-detail__content">
          {isEditing ? (
            <EditBookForm
              book={currentBook}
              onCancel={() => setIsEditing(false)}
              onSaveCallback={(data) => {
                if (!data) {
                  setCurrentBook(null);
                  setIsEditing(false);
                  return;
                }

                setCurrentBook(data);
                setIsEditing(false);
              }}
            />
          ) : (
            <>
              <div>
                <span className="book-detail__status">{statusText}</span>

                <div className="book-detail__headline">
                  <div>
                    <h2 className="book-detail__title">{currentBook.title}</h2>
                    <p className="book-detail__author">{currentBook.author}</p>
                  </div>

                  <span className="book-detail__year">
                    Tahun: {currentBook.year}
                  </span>
                </div>
              </div>

              <div className="book-detail__synopsis">
                <h3 className="book-detail__section-title">Sinopsis</h3>
                <p className="book-detail__synopsis-text">
                  {currentBook.synopsis}
                </p>
              </div>

              <div className="book-detail__note">
                <label
                  className="book-detail__note-label"
                  htmlFor={`book-note-${currentBook.id}`}
                >
                  Catatan Pribadi
                </label>
                <div className="book-detail__note-control">
                  <textarea
                    className="book-detail__note-input"
                    id={`book-note-${currentBook.id}`}
                    placeholder="Tambahkan catatan Anda di sini..."
                  />
                  <Button className="book-detail__note-action" type="button">
                    <Pencil />
                  </Button>
                </div>
              </div>

              <div className="book-detail__actions sm:grid-cols-3">
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      className="book-detail__delete"
                      disabled={isDeleting}
                      type="button"
                    >
                      {isDeleting && (
                        <LoaderCircle className="size-4 animate-spin" />
                      )}
                      {isDeleting ? "Menghapus..." : "Delete"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <Trash2 />
                      </AlertDialogMedia>
                      <div>
                        <AlertDialogTitle>Hapus buku ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Buku "{currentBook.title}" akan dihapus dari koleksi
                          Anda. Tindakan ini tidak bisa dibatalkan.
                        </AlertDialogDescription>
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Batal
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isDeleting}
                        variant="destructive"
                        onClick={(event) => {
                          event.preventDefault();
                          onDelete();
                        }}
                      >
                        {isDeleting && (
                          <LoaderCircle className="size-4 animate-spin" />
                        )}
                        {isDeleting ? "Menghapus..." : "Hapus Buku"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  className="book-detail__update"
                  onClick={() => setIsEditing(true)}
                  type="button"
                  variant="outline"
                >
                  Update
                </Button>
                <Button className="book-detail__status-action" type="button">
                  Update status '{statusText}'
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
