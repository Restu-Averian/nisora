import { Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const fieldClassName = "gap-1.5";

export function TextField({ control, id, label, name, placeholder }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={fieldClassName} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <FieldContent>
            <input
              {...field}
              aria-invalid={fieldState.invalid}
              className="form-control book-field__text-input"
              id={id}
              placeholder={placeholder}
              type="text"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
