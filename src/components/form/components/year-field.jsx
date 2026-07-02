import { Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const fieldClassName = "gap-1.5";

export function YearField({ control }) {
  return (
    <Controller
      control={control}
      name="published_year"
      render={({ field, fieldState }) => (
        <Field className={fieldClassName} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="book-year">Tahun Baca</FieldLabel>
          <FieldContent>
            <input
              className="form-control book-field__year-input"
              id="book-year"
              type="text"
              aria-invalid={fieldState.invalid}
              name={field.name}
              ref={field.ref}
              value={field.value ?? ""}
              onChange={(event) => {
                const raw = event.target.value;

                field.onChange(raw === "" ? undefined : raw);
              }}
              onBlur={field.onBlur}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
