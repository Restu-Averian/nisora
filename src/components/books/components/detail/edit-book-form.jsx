import React, { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useCoverPreview } from "@/components/form/hooks/use-cover-preview";
import useBooksStore from "@/store/booksStore";
import {
  LoaderCircle,
  Trash2,
  BookOpen,
  Save,
  CloudUpload,
} from "lucide-react";
import { useShallow } from "zustand/shallow";
import { YearPicker } from "@/components/ui/year-picker";

const bookSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  author: z.string().min(1, "Penulis wajib diisi"),
  published_year: z.coerce
    .number()
    .min(1900, "Tahun tidak valid")
    .max(2100, "Tahun tidak valid"),
  status: z.string().optional(),
  category: z.string().optional(),
  synopsis: z.string().optional(),
  cover: z.any().optional(),
});

const editFieldInputClassName =
  "h-10 rounded-md border border-[#d6cbbd] bg-background/75 px-3 py-2 text-[14px] text-[#141118] shadow-[0_1px_2px_rgba(20,17,24,0.05)] placeholder:text-[#8f8880] focus-visible:border-primary-accent focus-visible:ring-2 focus-visible:ring-primary-accent/25";
const editTextareaClassName =
  "min-h-[100px] resize-none rounded-md border border-[#d6cbbd] bg-background/75 px-3 py-2 text-[14px] text-[#141118] shadow-[0_1px_2px_rgba(20,17,24,0.05)] placeholder:text-[#8f8880] focus-visible:border-primary-accent focus-visible:ring-2 focus-visible:ring-primary-accent/25";
const editFieldLabelClassName =
  "text-[10px] font-bold tracking-[0.08em] uppercase text-[#5a5348] mb-1.5";
const editFieldDescClassName = "text-[12px] text-[#8f8880] mt-1.5 leading-snug";
const maxCoverSizeBytes = 5 * 1024 * 1024;
const statusOptions = [
  { label: "Sedang Dibaca", value: "reading" },
  { label: "Selesai Dibaca", value: "finished" },
];

function normalizeBookStatus(status) {
  return statusOptions.some((option) => option.value === status)
    ? status
    : "reading";
}

function validateCoverFile(file) {
  if (!file.type.startsWith("image/")) {
    return "Format sampul harus berupa gambar.";
  }

  if (file.size > maxCoverSizeBytes) {
    return "Ukuran sampul maksimal 5MB.";
  }

  return null;
}

const StatusSelect = React.forwardRef(
  (
    {
      className,
      value,
      onChange,
      onBlur,
      name,
      id,
      disabled,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => (
    <Select
      disabled={disabled}
      name={name}
      value={value ?? ""}
      onValueChange={onChange}
    >
      <SelectTrigger
        ref={ref}
        id={id}
        aria-invalid={ariaInvalid}
        disabled={disabled}
        onBlur={onBlur}
        className={cn(className, "relative pl-9 w-full")}
        {...props}
      >
        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#426b91] pointer-events-none" />
        <SelectValue placeholder="Pilih status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
);
StatusSelect.displayName = "StatusSelect";

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
  description,
  action,
  ...props
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid} className="gap-0">
        <FieldLabel
          className={cn(editFieldLabelClassName, labelClassName)}
          htmlFor={id}
        >
          {label}
        </FieldLabel>
        <FieldContent className={contentClassName}>
          <Component
            {...field}
            {...props}
            id={id}
            type={type}
            aria-invalid={fieldState.invalid}
            className={cn("form-control w-full", controlClassName)}
            value={field.value ?? ""}
          />
          {description && (
            <div className={editFieldDescClassName}>{description}</div>
          )}
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
      title: book.title || "",
      author: book.author || "",
      published_year: book.year || "",
      status: normalizeBookStatus(book.status),
      category: book.category || "",
      synopsis: book.synopsis || "",
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

      if (typeof File !== "undefined" && data.cover instanceof File) {
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

        if (!publicUrlData?.publicUrl) {
          toast.error("Gagal mengunggah sampul", {
            description: "URL sampul tidak tersedia.",
          });
          return;
        }

        coverUrl = `${publicUrlData?.publicUrl}?v=${data.cover.lastModified}`;
      } else if (typeof data.cover === "string") {
        coverUrl = data.cover;
      }

      const title = data.title.trim();
      const author = data.author.trim();
      const synopsis = data.synopsis?.trim() || "";

      const { book: updatedBook, error } = await updateBook({
        bookId: book.id,
        payload: {
          title,
          authors: author ? [author] : [],
          published_year: data.published_year,
          status: normalizeBookStatus(data.status),
          synopsis,
          cover_url: data.cover === null ? null : coverUrl,
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
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Left Column */}
        <div className="flex w-full shrink-0 flex-col rounded-2xl border border-dashed border-[#ebd9c8] bg-[#fdfcf7] p-5 md:w-[280px]">
          <div className="flex flex-col items-center gap-1.5 pb-4">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#5a5348] uppercase">
              Sampul Buku
            </span>
            <div className="flex items-center gap-1.5 text-[#5a5348]">
              <span className="h-[1px] w-2 bg-current opacity-30"></span>
              <span className="h-[1px] w-4 bg-current opacity-30"></span>
              <span className="h-[1px] w-2 bg-current opacity-30"></span>
            </div>
          </div>

          <label
            htmlFor="book-cover-upload"
            className="group relative flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-[#c7bcae] p-5 transition-colors hover:bg-black/5"
          >
            <Controller
              control={form.control}
              name="cover"
              render={({ field, fieldState }) => (
                <>
                  <input
                    id="book-cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;

                      if (!file) {
                        setCoverFile(null);
                        field.onChange(undefined);
                        return;
                      }

                      const fileError = validateCoverFile(file);

                      if (fileError) {
                        form.setError("cover", { message: fileError });
                        e.target.value = "";
                        return;
                      }

                      form.clearErrors("cover");
                      setCoverFile(file);
                      field.onChange(file);
                    }}
                  />
                  {fieldState.invalid && (
                    <div className="absolute left-5 right-5 top-full mt-2">
                      <FieldError errors={[fieldState.error]} />
                    </div>
                  )}
                </>
              )}
            />

            {coverPreview ? (
              <div className="relative mb-5 w-[140px] shrink-0">
                <img
                  src={coverPreview}
                  alt="Sampul Buku"
                  className="w-full rounded-md object-cover shadow-[0_12px_24px_-8px_rgba(0,0,0,0.4)]"
                />
              </div>
            ) : (
              <div className="mb-5 flex h-[200px] w-[140px] shrink-0 items-center justify-center rounded-md bg-[#ebd9c8]/30">
                <span className="text-xs text-[#8f8880]">Pilih Sampul</span>
              </div>
            )}

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-[#7d7465]">
                <CloudUpload className="h-[18px] w-[18px]" />
                <span className="text-[13px] font-medium">
                  Klik untuk mengganti sampul
                </span>
              </div>
              <span className="text-[11px] text-[#a39c93]">
                Format: JPG, PNG • Maks. 5MB
              </span>
            </div>
          </label>

          {coverPreview && (
            <Button
              type="button"
              variant="outline"
              className="mt-6 w-full rounded-xl border-[#f5b8b8] bg-transparent text-[#d85763] hover:bg-[#d85763]/10"
              onClick={() => {
                setCoverFile(null);
                form.clearErrors("cover");
                form.setValue("cover", null);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Sampul
            </Button>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-1 flex-col space-y-6">
          <FieldRender
            control={form.control}
            controlClassName={editFieldInputClassName}
            id="title"
            label="Judul Buku"
            description="Masukkan judul buku sesuai sampul atau edisi yang Anda miliki."
            name="title"
            Component={Input}
          />

          <FieldRender
            control={form.control}
            controlClassName={editFieldInputClassName}
            id="author"
            label="Penulis"
            description="Nama penulis atau pengarang buku."
            name="author"
            Component={Input}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FieldRender
              control={form.control}
              controlClassName={editFieldInputClassName}
              id="published-year"
              label="Tahun"
              description="Tahun terbit buku."
              name="published_year"
              Component={YearPicker}
            />

            <FieldRender
              control={form.control}
              controlClassName={editFieldInputClassName}
              id="status"
              label="Status"
              description="Pilih status bacaan Anda saat ini."
              name="status"
              Component={StatusSelect}
            />
          </div>

          <FieldRender
            control={form.control}
            controlClassName={editFieldInputClassName}
            id="category"
            label="Kategori / Genre"
            description="Pisahkan beberapa kategori dengan koma."
            name="category"
            Component={Input}
          />

          <FieldRender
            control={form.control}
            controlClassName={editTextareaClassName}
            id="synopsis"
            label="Catatan Pribadi"
            description="Catatan pribadi Anda tentang buku ini (opsional)."
            name="synopsis"
            Component={Textarea}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between border-t border-[#ebd9c8] pt-6">
        <div>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                className="border-[#f5b8b8] bg-transparent text-[#d85763] hover:bg-[#d85763]/10"
                disabled={isBusy}
                type="button"
                variant="outline"
              >
                {isDeleting ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
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
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isDeleting ? "Menghapus..." : "Hapus Buku"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex gap-3">
          <Button
            disabled={isBusy}
            type="button"
            variant="outline"
            className="border-[#d6cbbd] bg-transparent text-[#5a5348] hover:bg-[#d6cbbd]/20"
            onClick={onCancel}
          >
            Batal
          </Button>
          <Button
            disabled={isBusy}
            type="submit"
            className="bg-[#426b91] text-white hover:bg-[#426b91]/90 shadow-sm"
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </form>
  );
}
