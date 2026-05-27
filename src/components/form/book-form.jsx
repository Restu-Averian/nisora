import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { useBreakpoint } from "@/js-toolkit/src/react";
import { BookCoverField } from "./components/book-cover-field";
import { BookTitleField } from "./components/book-title-field";
import { FormActions } from "./components/form-actions";
import { SynopsisField } from "./components/synopsis-field";
import { TextField } from "./components/text-field";
import { YearField } from "./components/year-field";
import { useBookSearch } from "./hooks/use-book-search";
import { useCoverPreview } from "./hooks/use-cover-preview";
import { BOOK_FORM_DEFAULT_VALUES, formSchema } from "./schema";

export default function BookForm() {
  const [coverFile, setCoverFile] = useState(null);

  const { xs } = useBreakpoint();

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
    form.setValue("title", book.title, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("synopsis", book.synopsis ?? "", { shouldDirty: true });
    form.setValue("author", book.author ?? "", { shouldDirty: true });
    form.setValue("year", book.year ?? undefined, { shouldDirty: true });
    form.setValue("cover", book.cover || undefined, { shouldDirty: true });
    setCoverFile(book.cover || null);
    resetBookSearch();
  }

  function onSubmit(data) {
    console.log(data);
    resetFormState();
  }

  const handleSubmit = useCallback(
    (event) => {
      void form.handleSubmit(onSubmit)(event);
    },
    [form],
  );

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-4">
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
          onCoverChange={setCoverFile}
        />

        <TextField
          control={form.control}
          id="book-author"
          label="Pengarang"
          name="author"
        />

        <YearField control={form.control} />

        <FormActions onCancel={resetFormState} />
      </FieldGroup>
    </form>
  );
}
