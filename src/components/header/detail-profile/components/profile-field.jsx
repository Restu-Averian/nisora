import { Controller } from "react-hook-form";
import * as Icons from "lucide-react";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export default function ProfileField({ control, id, label, name, type, icon }) {
  const IconComponent = icon ? Icons[icon] : null;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="profile-field" data-invalid={fieldState.invalid}>
          <div className="profile-field__label-wrap">
            {IconComponent && <IconComponent className="profile-field__label-icon" />}
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
          </div>
          <FieldContent>
            <input
              {...field}
              aria-invalid={fieldState.invalid}
              className="form-control profile-field__input"
              id={id}
              type={type}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
