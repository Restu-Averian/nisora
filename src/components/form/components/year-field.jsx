import { Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { YearPicker } from "@/components/ui/year-picker";

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
            <YearPicker
              className="form-control book-field__year-input"
              disabled={field.disabled}
              id="book-year"
              aria-invalid={fieldState.invalid}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
