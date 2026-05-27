import { Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export function SynopsisField({ control }) {
  return (
    <Controller
      control={control}
      name="synopsis"
      render={({ field, fieldState }) => (
        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="book-synopsis">Sinopsis</FieldLabel>
          <FieldContent>
            <textarea
              {...field}
              aria-invalid={fieldState.invalid}
              className="form-control min-h-textarea resize-none py-2"
              id="book-synopsis"
              placeholder="Sinopsis"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
