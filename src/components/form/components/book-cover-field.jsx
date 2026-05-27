import { Controller } from "react-hook-form";
import { Upload } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export function BookCoverField({
  control,
  coverFile,
  coverPreview,
  onCoverChange,
}) {
  return (
    <Controller
      control={control}
      name="cover"
      render={({ field, fieldState }) => (
        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="book-cover">Upload Sampul Buku</FieldLabel>
          <FieldContent>
            <input
              accept="image/*"
              className="sr-only"
              id="book-cover"
              name={field.name}
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];

                onCoverChange(file ?? null);
                field.onChange(file ?? undefined);
              }}
              onBlur={field.onBlur}
              ref={field.ref}
            />
            <label
              className="flex min-h-upload w-full items-center justify-center gap-3 rounded-md border border-dashed border-border bg-background/60 p-3 text-secondary-text transition-colors hover:bg-surface"
              htmlFor="book-cover"
            >
              {coverPreview ? (
                <>
                  <img
                    alt="Preview sampul buku"
                    className="h-20 w-14 rounded object-cover shadow-cover"
                    src={coverPreview}
                  />
                  <span className="min-w-0 text-sm">
                    <span className="block truncate font-semibold text-primary-text">
                      {typeof coverFile === "string"
                        ? "Sampul dari Open Library"
                        : coverFile?.name}
                    </span>
                    <span className="block text-xs text-secondary-text">
                      Klik untuk ganti file
                    </span>
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center gap-2">
                  <Upload className="size-5" />
                  <span className="text-sm">Pilih file</span>
                </span>
              )}
            </label>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
