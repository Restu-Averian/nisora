import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { useBreakpoint } from "@/js-toolkit/src/react";
import supabase from "@/lib/supabase";
import { BookCoverField } from "./components/book-cover-field";
import { BookTitleField } from "./components/book-title-field";
import { FormActions } from "./components/form-actions";
import { SynopsisField } from "./components/synopsis-field";
import { TextField } from "./components/text-field";
import { YearField } from "./components/year-field";
import { useBookSearch } from "./hooks/use-book-search";
import { useCoverPreview } from "./hooks/use-cover-preview";
import { BOOK_FORM_DEFAULT_VALUES, formSchema } from "./schema";

export default function BookForm({ onSuccessCallback }) {
  const [coverFile, setCoverFile] = useState(null);

  const { xs } = useBreakpoint();
  const toastPosition = xs ? "top-center" : "top-right";

  const { bookSearch, handleBookSearch, resetBookSearch } = useBookSearch();

  const coverPreview = useCoverPreview(coverFile);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: BOOK_FORM_DEFAULT_VALUES,
  });

  function resetFormState() {
    form.reset();
    setCoverFile(null);
    resetBookSearch();
  }

  function handleBookSelect(book) {
    form?.setValue("title", book.title, {
      shouldDirty: true,
      shouldValidate: true,
    });

    form.setValue("synopsis", book.synopsis ?? "", { shouldDirty: true });

    form.setValue("author", book.author ?? "", { shouldDirty: true });

    form.setValue("published_year", book.year ?? undefined, {
      shouldDirty: true,
    });

    form.setValue("cover", book.cover || undefined, { shouldDirty: true });

    setCoverFile(book.cover || null);

    resetBookSearch();
  }

  async function uploadCoverFile({ file, session }) {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("books")
      .upload(filePath, file);

    if (uploadError) {
      return { coverUrl: null, error: uploadError };
    }

    const { data: publicUrlData } = supabase.storage
      .from("books")
      .getPublicUrl(filePath);

    return { coverUrl: publicUrlData?.publicUrl ?? null, error: null };
  }

  async function onSubmit(data) {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast.error("Sesi berakhir", {
        description: "Silakan login ulang untuk menambahkan buku.",
        position: toastPosition,
      });
      return;
    }

    const title = data.title.trim();
    const author = data.author?.trim();
    const synopsis = data.synopsis?.trim();
    let coverUrl = typeof data.cover === "string" ? data.cover : null;

    if (data.cover instanceof File) {
      const { coverUrl: uploadedCoverUrl, error: uploadError } =
        await uploadCoverFile({
          file: data.cover,
          session,
        });

      if (uploadError) {
        toast.error("Gagal mengunggah sampul", {
          description: uploadError.message,
          position: toastPosition,
        });
        return;
      }

      coverUrl = uploadedCoverUrl;
    }

    const payload = {
      user_id: session.user.id,
      title,
      authors: author ? [author] : [],
      synopsis: synopsis || null,
      published_year: data.published_year ?? null,
      cover_url: coverUrl,
    };

    const { error } = await supabase.from("books").insert(payload);

    if (error) {
      toast.error("Gagal menambahkan buku", {
        description: error.message,
        position: toastPosition,
      });
      return;
    }

    toast.success("Buku berhasil ditambahkan", {
      description: "Buku baru sudah tersimpan.",
      position: toastPosition,
    });

    resetFormState();
    onSuccessCallback?.();
  }

  return (
    <form
      className="min-h-0 flex-1 overflow-y-auto pb-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="book-form__group">
        <BookTitleField
          bookSearch={bookSearch}
          control={form.control}
          isMobile={xs}
          onBookSelect={handleBookSelect}
          onResetSearch={resetBookSearch}
          onSearch={handleBookSearch}
        />

        <SynopsisField control={form.control} />

        <BookCoverField
          control={form.control}
          coverFile={coverFile}
          coverPreview={coverPreview}
          onCoverChange={(file) => {
            setCoverFile(file);
          }}
        />

        <TextField
          control={form.control}
          id="book-author"
          label="Pengarang"
          name="author"
        />

        <YearField control={form.control} />

        <FormActions
          isSubmitting={form.formState.isSubmitting}
          onCancel={resetFormState}
        />
      </FieldGroup>
    </form>
  );
}
