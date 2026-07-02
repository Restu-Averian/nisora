import { Controller } from "react-hook-form";
import { Upload } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const fieldClassName = "gap-1.5";

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
        <Field className={fieldClassName} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="book-cover">Upload Sampul Buku</FieldLabel>
          <FieldContent>
            <input
              accept="image/*"
              className="book-cover__input"
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
              className="book-cover__dropzone"
              htmlFor="book-cover"
            >
              {coverPreview ? (
                <>
                  <img
                    alt="Preview sampul buku"
                    className="book-cover__preview"
                    src={coverPreview}
                  />
                  <span className="book-cover__text">
                    <span className="book-cover__name">
                      {typeof coverFile === "string"
                        ? "Sampul dari Open Library"
                        : coverFile?.name}
                    </span>
                    <span className="book-cover__hint">
                      Klik untuk ganti file
                    </span>
                  </span>
                </>
              ) : (
                <span className="book-cover__empty">
                  <Upload className="book-cover__icon" />
                  <span className="book-cover__empty-text">Pilih file</span>
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
