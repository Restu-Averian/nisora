import { Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export function YearField({ control }) {
  return (
    <Controller
      control={control}
      name="year"
      render={({ field, fieldState }) => (
        <Field className="book-form__field" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="book-year">Tahun Baca</FieldLabel>
          <FieldContent>
            <input
              className="form-control book-field__year-input"
              id="book-year"
              type="text"
              aria-invalid={fieldState.invalid}
              value={field.value ?? ""}
              onChange={(event) => {
                const raw = event.target.value;

                field.onChange(raw === "" ? undefined : Number(raw));
              }}
              // onBlur={field.onBlur}
              // ref={field.ref}
              // name={field.name}
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
