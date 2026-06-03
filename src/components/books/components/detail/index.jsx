import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { TABS } from "@/data/books";
import useBooksStore from "@/store/booksStore";
import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import EditBookForm, { FieldRender } from "./edit-book-form";

const personalNoteSchema = z.object({
  personal_note: z.string().optional(),
});

function PersonalNoteForm({ book, onSaved, updateBook }) {
  const form = useForm({
    resolver: zodResolver(personalNoteSchema),
    defaultValues: {
      personal_note: book.personal_note ?? "",
    },
  });
  const { reset, setError } = form;

  useEffect(() => {
    reset({
      personal_note: book.personal_note ?? "",
    });
  }, [book.id, book.personal_note, reset]);

  async function onSubmit(data) {
    const { book: updatedBook, error } = await updateBook({
      bookId: book.id,
      payload: {
        personal_note: data.personal_note ?? "",
      },
    });

    if (error) {
      setError("personal_note", {
        message: error.message,
      });
      toast.error("Gagal memperbarui catatan", {
        description: error.message,
      });
      return;
    }

    reset({
      personal_note: updatedBook.personal_note ?? "",
    });
    onSaved(updatedBook);
    toast.success("Catatan pribadi diperbarui");
  }

  return (
    <form className="book-detail__note" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldRender
        action={
          <Button
            aria-label="Simpan catatan pribadi"
            className="book-detail__note-action"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Pencil />
            )}
          </Button>
        }
        contentClassName="book-detail__note-control"
        control={form.control}
        controlClassName="book-detail__note-input"
        id={`book-note-${book.id}`}
        labelClassName="book-detail__note-label"
        label="Catatan Pribadi"
        name="personal_note"
        Component={Textarea}
        placeholder="Tambahkan catatan Anda di sini..."
        rows={4}
      />
    </form>
  );
}

export default function BookDetail({ book }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);
  const [currentBookId, setCurrentBookId] = useState(book?.id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteBook, updateBook, updateBookStatus } = useBooksStore(
    useShallow((state) => {
      return {
        deleteBook: state.deleteBook,
        updateBook: state.updateBook,
        updateBookStatus: state.updateBookStatus,
      };
    }),
  );
  const { statusText, nextStatusValue } = useMemo(() => {
    return {
      statusText:
        TABS.find((tab) => tab.value === currentBook?.status)?.label ?? "-",
      nextStatusValue:
        currentBook?.status === "finished" ? "reading" : "finished",
    };
  }, [currentBook]);

  const nextStatusLabel = useMemo(() => {
    return TABS.find((tab) => tab.value === nextStatusValue)?.label ?? "-";
  }, [nextStatusValue]);

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

  async function onUpdateBookStatus() {
    setIsUpdatingStatus(true);

    const { error } = await updateBookStatus({
      bookId: currentBook.id,
      newStatusValue: nextStatusValue,
    });

    if (error) {
      toast.error("Gagal mengubah status buku", {
        description: error.message,
      });
      setIsUpdatingStatus(false);
      return;
    }

    setCurrentBook((current) => {
      return {
        ...current,
        status: nextStatusValue,
      };
    });

    toast.success("Status buku diperbarui", {
      description: `Buku dipindahkan ke ${nextStatusLabel}.`,
    });
    setIsUpdatingStatus(false);
  }

  if (currentBookId !== book?.id) {
    setCurrentBookId(book?.id);
    setCurrentBook(book);
    setIsEditing(false);
  }

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

              <PersonalNoteForm
                book={currentBook}
                onSaved={setCurrentBook}
                updateBook={updateBook}
              />

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
                <Button
                  className="book-detail__status-action"
                  disabled={isUpdatingStatus}
                  onClick={onUpdateBookStatus}
                  type="button"
                >
                  {isUpdatingStatus && (
                    <LoaderCircle className="size-4 animate-spin" />
                  )}
                  {isUpdatingStatus
                    ? "Memindahkan..."
                    : `Pindahkan ke '${nextStatusLabel}'`}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
