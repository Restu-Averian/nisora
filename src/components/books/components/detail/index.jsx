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
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  LoaderCircle,
  Pencil,
  Tag,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import EditBookForm, { FieldRender } from "./edit-book-form";

const personalNoteSchema = z.object({
  personal_note: z.string().optional(),
});

const noteInputClassName =
  "min-h-[124px] w-full resize-none rounded-xl border border-border bg-background/70 px-5 py-7 text-[17px] leading-relaxed text-primary-text shadow-[0_10px_26px_rgba(78,74,86,0.08)] outline-none focus-visible:border-primary-accent focus-visible:ring-2 focus-visible:ring-primary-accent/30";
const noteLabelClassName =
  "mb-3 block text-[15px] font-bold uppercase leading-tight tracking-widest text-primary-text";
const noteActionClassName =
  "absolute bottom-6 right-6 rounded-full bg-soft-accent text-primary-text shadow-[0_8px_18px_rgba(78,74,86,0.12)] hover:bg-primary-accent hover:text-primary-foreground";
const detailActionBaseClassName =
  "h-12 gap-3 rounded-lg text-[15px] font-semibold normal-case tracking-normal";
const deleteActionClassName = `${detailActionBaseClassName} border border-[#d85763] bg-transparent text-[#d85763] hover:bg-[#d85763]/10`;
const updateActionClassName = `${detailActionBaseClassName} border-primary-accent text-primary-text hover:bg-soft-accent hover:text-primary-text`;
const statusActionClassName = `${detailActionBaseClassName} bg-primary-accent text-primary-foreground shadow-[0_8px_16px_rgba(118,147,183,0.24)] hover:bg-hover-accent`;

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
    if (!book?.id) {
      toast.error("Gagal memperbarui catatan", {
        description: "Data buku tidak lengkap.",
      });
      return;
    }

    if (typeof updateBook !== "function") {
      toast.error("Gagal memperbarui catatan", {
        description: "Aksi pembaruan tidak tersedia.",
      });
      return;
    }

    try {
      const payload = {
        personal_note: data.personal_note ?? "",
      };
      const { book: updatedBook, error } = await updateBook({
        bookId: book.id,
        payload,
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

      const nextBook = updatedBook ?? {
        ...book,
        personal_note: payload.personal_note,
      };

      reset({
        personal_note: nextBook.personal_note ?? "",
      });
      onSaved?.(nextBook);
      toast.success("Catatan pribadi diperbarui");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan.";

      setError("personal_note", {
        message,
      });
      toast.error("Gagal memperbarui catatan", {
        description: message,
      });
      return;
    }
  }

  return (
    <form className="book-detail__note" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldRender
        action={
          <Button
            aria-label="Simpan catatan pribadi"
            className={noteActionClassName}
            disabled={form.formState.isSubmitting}
            size="icon"
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Pencil />
            )}
          </Button>
        }
        contentClassName="relative"
        control={form.control}
        controlClassName={noteInputClassName}
        id={`book-note-${book.id}`}
        labelClassName={noteLabelClassName}
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
  const [updatedBook, setUpdatedBook] = useState(null);
  const [deletedBookId, setDeletedBookId] = useState(null);
  const [coverFailedBookId, setCoverFailedBookId] = useState(null);
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
  const currentBook = useMemo(() => {
    if (!book?.id || deletedBookId === book.id) {
      return null;
    }

    if (updatedBook?.id === book.id) {
      return updatedBook;
    }

    return book;
  }, [book, deletedBookId, updatedBook]);

  const { statusText, nextStatusValue } = useMemo(() => {
    return {
      statusText:
        TABS.find((tab) => tab.value === currentBook?.status)?.label ?? "-",
      nextStatusValue:
        currentBook?.status === "finished" ? "reading" : "finished",
    };
  }, [currentBook]);

  const bookMeta = useMemo(() => {
    const year = currentBook?.year ? `Tahun Terbit: ${currentBook.year}` : null;
    const categories = [
      currentBook?.category,
      currentBook?.genre,
      currentBook?.categories,
      currentBook?.tags,
    ]
      .flat()
      .filter(Boolean)
      .join(", ");

    return {
      author: currentBook?.author || "Penulis tidak diketahui",
      coverAlt: currentBook?.title
        ? `Sampul ${currentBook.title}`
        : "Sampul buku",
      coverInitial: currentBook?.title?.trim()?.charAt(0)?.toUpperCase() || "?",
      synopsis: currentBook?.synopsis || "Sinopsis belum tersedia.",
      year,
      categories: categories || "Kategori belum tersedia",
    };
  }, [currentBook]);

  const nextStatusLabel = useMemo(() => {
    return TABS.find((tab) => tab.value === nextStatusValue)?.label ?? "-";
  }, [nextStatusValue]);

  async function onDelete() {
    if (!currentBook?.id) {
      toast.error("Gagal menghapus buku", {
        description: "Data buku tidak lengkap.",
      });
      return;
    }

    if (typeof deleteBook !== "function") {
      toast.error("Gagal menghapus buku", {
        description: "Aksi hapus tidak tersedia.",
      });
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await deleteBook({ bookId: currentBook.id });

      if (error) {
        toast.error("Gagal menghapus buku", {
          description: error.message,
        });
        return;
      }

      toast.success("Buku berhasil dihapus");
      setDeletedBookId(currentBook.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Gagal menghapus buku", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function onUpdateBookStatus() {
    if (!currentBook?.id) {
      toast.error("Gagal mengubah status buku", {
        description: "Data buku tidak lengkap.",
      });
      return;
    }

    if (typeof updateBookStatus !== "function") {
      toast.error("Gagal mengubah status buku", {
        description: "Aksi pembaruan status tidak tersedia.",
      });
      return;
    }

    setIsUpdatingStatus(true);

    try {
      const { error } = await updateBookStatus({
        bookId: currentBook.id,
        newStatusValue: nextStatusValue,
      });

      if (error) {
        toast.error("Gagal mengubah status buku", {
          description: error.message,
        });
        return;
      }

      setUpdatedBook((current) => {
        const targetBook =
          current?.id === currentBook.id ? current : currentBook;

        return {
          ...targetBook,
          status: nextStatusValue,
        };
      });

      toast.success("Status buku diperbarui", {
        description: `Buku dipindahkan ke ${nextStatusLabel}.`,
      });
    } catch (error) {
      toast.error("Gagal mengubah status buku", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  if (!currentBook) {
    return null;
  }

  return (
    <section className="book-detail md:overflow-y-visible">
      <div className={`book-detail__layout ${isEditing ? "is-editing" : ""}`}>
        {!isEditing && (
          <div className="book-detail__cover-wrap">
            {currentBook.cover && coverFailedBookId !== currentBook.id ? (
              <img
                alt={bookMeta.coverAlt}
                className="book-detail__cover"
                onError={() => setCoverFailedBookId(currentBook.id)}
                src={currentBook.cover}
              />
            ) : (
              <div
                aria-label={bookMeta.coverAlt}
                className="book-detail__cover-fallback"
              >
                {bookMeta.coverInitial}
              </div>
            )}
          </div>
        )}

        <div className="book-detail__content">
          {isEditing ? (
            <EditBookForm
              book={currentBook}
              onCancel={() => setIsEditing(false)}
              onSaveCallback={(data) => {
                if (!data) {
                  setDeletedBookId(currentBook.id);
                  setIsEditing(false);
                  return;
                }

                setUpdatedBook(data);
                setCoverFailedBookId(null);
                setIsEditing(false);
              }}
            />
          ) : (
            <>
              <div className="book-detail__header">
                <span className="book-detail__status">
                  <BookOpen />
                  {statusText}
                </span>

                <div className="book-detail__headline">
                  <div>
                    <h2 className="book-detail__title">
                      {currentBook.title || "Judul tidak tersedia"}
                    </h2>
                    <p className="book-detail__author">
                      <UserRound />
                      {bookMeta.author}
                    </p>
                  </div>
                </div>

                <div className="book-detail__meta">
                  {bookMeta.year && (
                    <span className="book-detail__meta-item">
                      <Calendar />
                      {bookMeta.year}
                    </span>
                  )}
                  <span className="book-detail__meta-separator">•</span>
                  <span className="book-detail__meta-item">
                    <Tag />
                    {bookMeta.categories}
                  </span>
                </div>
              </div>

              <div className="book-detail__synopsis">
                <h3 className="book-detail__section-title">
                  Sinopsis
                  <span />
                </h3>
                <p className="book-detail__synopsis-text">
                  {bookMeta.synopsis}
                </p>
              </div>

              <PersonalNoteForm
                book={currentBook}
                onSaved={setUpdatedBook}
                updateBook={updateBook}
              />

              <div className="book-detail__actions sm:grid-cols-3">
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      className={deleteActionClassName}
                      disabled={isDeleting}
                      type="button"
                    >
                      {isDeleting && (
                        <LoaderCircle className="size-4 animate-spin" />
                      )}
                      {!isDeleting && <Trash2 />}
                      {isDeleting ? "Menghapus..." : "Hapus Buku"}
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
                  className={updateActionClassName}
                  onClick={() => setIsEditing(true)}
                  type="button"
                  variant="outline"
                >
                  <Pencil />
                  Perbarui Informasi
                </Button>
                <Button
                  className={statusActionClassName}
                  disabled={isUpdatingStatus}
                  onClick={onUpdateBookStatus}
                  type="button"
                >
                  {isUpdatingStatus && (
                    <LoaderCircle className="size-4 animate-spin" />
                  )}
                  {!isUpdatingStatus && <CheckCircle2 />}
                  {isUpdatingStatus
                    ? "Memindahkan..."
                    : currentBook.status === "finished"
                      ? "Tandai Dibaca Lagi"
                      : "Tandai Selesai"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
