import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { BookCoverField } from "@/components/form/components/book-cover-field";
import { useCoverPreview } from "@/components/form/hooks/use-cover-preview";
import useBooksStore from "@/store/booksStore";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useShallow } from "zustand/shallow";

const bookSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  author: z.string().min(1, "Penulis wajib diisi"),
  published_year: z.coerce
    .number()
    .min(1900, "Tahun tidak valid")
    .max(2100, "Tahun tidak valid"),
  synopsis: z.string().min(1, "Sinopsis wajib diisi"),
  cover: z.any().optional(),
});

const editFieldInputClassName =
  "h-10 rounded-md border border-[#d6cbbd] bg-background/75 px-3 py-2 text-[15px] text-[#141118] shadow-[0_1px_2px_rgba(20,17,24,0.05)] placeholder:text-[#8f8880] focus-visible:border-primary-accent focus-visible:ring-2 focus-visible:ring-primary-accent/25";
const editTextareaClassName =
  "min-h-textarea resize-none rounded-md border border-[#d6cbbd] bg-background/75 px-3 py-2 text-[15px] text-[#141118] shadow-[0_1px_2px_rgba(20,17,24,0.05)] placeholder:text-[#8f8880] focus-visible:border-primary-accent focus-visible:ring-2 focus-visible:ring-primary-accent/25";
const deleteButtonClassName =
  "border border-[#d85763] bg-transparent text-[#d85763] hover:bg-[#d85763]/10";

export const FieldRender = ({
  control,
  contentClassName,
  controlClassName,
  id,
  label,
  labelClassName,
  name,
  Component,
  type = "text",
  action,
  ...props
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel className={labelClassName} htmlFor={id}>
          {label}
        </FieldLabel>
        <FieldContent className={contentClassName}>
          <Component
            {...field}
            {...props}
            id={id}
            type={type}
            aria-invalid={fieldState.invalid}
            className={cn("form-control", controlClassName)}
            value={field.value ?? ""}
          />
          {action}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldContent>
      </Field>
    )}
  />
);

export default function EditBookForm({ book, onCancel, onSaveCallback }) {
  const [coverFile, setCoverFile] = useState(book.cover);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const coverPreview = useCoverPreview(coverFile);
  const { updateBook, deleteBook } = useBooksStore(
    useShallow((state) => {
      return {
        updateBook: state.updateBook,
        deleteBook: state.deleteBook,
      };
    }),
  );

  const form = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      published_year: book.year,
      synopsis: book.synopsis,
      cover: book.cover,
    },
  });

  const isBusy = useMemo(
    () => form.formState.isSubmitting || isDeleting,
    [form.formState.isSubmitting, isDeleting],
  );

  async function onSubmit(data) {
    if (!book?.id) {
      toast.error("Gagal memperbarui buku", {
        description: "Data buku tidak lengkap.",
      });
      return;
    }

    if (typeof updateBook !== "function") {
      toast.error("Gagal memperbarui buku", {
        description: "Aksi pembaruan tidak tersedia.",
      });
      return;
    }

    try {
      let coverUrl = book.cover;

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error("Sesi berakhir", {
          description: "Silakan login ulang untuk menyimpan perubahan.",
        });
        return;
      }

      if (data.cover instanceof File) {
        const fileExt = data.cover.name.split(".").pop() || "jpg";
        const fileName = `${book.id}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("books")
          .upload(filePath, data.cover, { upsert: true });

        if (uploadError) {
          toast.error("Gagal mengunggah sampul", {
            description: uploadError.message,
          });
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("books")
          .getPublicUrl(filePath);

        coverUrl = `${publicUrlData?.publicUrl}?v=${data.cover.lastModified}`;
      } else if (typeof data.cover === "string") {
        coverUrl = data.cover;
      }

      const title = data.title.trim();
      const author = data.author.trim();
      const synopsis = data.synopsis.trim();

      const { book: updatedBook, error } = await updateBook({
        bookId: book.id,
        payload: {
          title,
          authors: author ? [author] : [],
          published_year: data.published_year,
          synopsis,
          cover_url: coverUrl,
        },
      });

      if (error) {
        toast.error("Gagal memperbarui buku", {
          description: error.message,
        });
        return;
      }

      toast.success("Buku berhasil diperbarui");
      onSaveCallback?.(updatedBook);
    } catch (error) {
      toast.error("Gagal memperbarui buku", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    }
  }

  async function onDelete() {
    if (!book?.id) {
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
      const { error } = await deleteBook({ bookId: book.id });

      if (error) {
        toast.error("Gagal menghapus buku", {
          description: error.message,
        });
        return;
      }

      toast.success("Buku berhasil dihapus");
      setIsDeleteDialogOpen(false);
      onSaveCallback?.(null);
    } catch (error) {
      toast.error("Gagal menghapus buku", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <BookCoverField
        control={form.control}
        coverFile={coverFile}
        coverPreview={coverPreview}
        onCoverChange={setCoverFile}
      />

      <FieldRender
        control={form.control}
        controlClassName={editFieldInputClassName}
        id="title"
        label="Judul Buku"
        name="title"
        Component={Input}
      />

      <FieldRender
        control={form.control}
        controlClassName={editFieldInputClassName}
        id="author"
        label="Penulis"
        name="author"
        Component={Input}
      />

      <FieldRender
        control={form.control}
        controlClassName={editFieldInputClassName}
        id="published-year"
        label="Tahun"
        name="published_year"
        Component={Input}
        type="number"
      />
      <FieldRender
        control={form.control}
        controlClassName={editTextareaClassName}
        id="synopsis"
        label="Sinopsis"
        name="synopsis"
        Component={Textarea}
      />

      <div className="flex flex-wrap gap-2 justify-end pt-4">
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button
              className={deleteButtonClassName}
              disabled={isBusy}
              type="button"
              variant="destructive"
            >
              {isDeleting && <LoaderCircle className="size-4 animate-spin" />}
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
                  Buku "{book.title}" akan dihapus dari koleksi Anda. Tindakan
                  ini tidak bisa dibatalkan.
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                variant="destructive"
                onClick={(event) => {
                  event.preventDefault();
                  onDelete();
                }}
              >
                {isDeleting && <LoaderCircle className="size-4 animate-spin" />}
                {isDeleting ? "Menghapus..." : "Hapus Buku"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          disabled={isBusy}
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Batal
        </Button>
        <Button disabled={isBusy} type="submit">
          {form.formState.isSubmitting && (
            <LoaderCircle className="size-4 animate-spin" />
          )}
          {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
