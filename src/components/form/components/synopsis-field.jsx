import { Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const fieldClassName = "gap-1.5";

export function SynopsisField({ control }) {
  return (
    <Controller
      control={control}
      name="synopsis"
      render={({ field, fieldState }) => (
        <Field className={fieldClassName} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="book-synopsis">Sinopsis</FieldLabel>
          <FieldContent>
            <textarea
              {...field}
              aria-invalid={fieldState.invalid}
              className="form-control book-field__textarea"
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
