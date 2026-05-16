import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Plus, Upload } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const formSchema = z.object({
  title: z.string().min(1, "Wajib diisi"),
  synopsis: z.string().optional(),
  cover: z.instanceof(File).optional(),
  author: z.string().optional(),
  year: z.number().int().positive().optional(),
});

export default function BookForm() {
  const [coverFile, setCoverFile] = useState(null);

  const coverPreview = useMemo(() => {
    if (!coverFile) {
      return "";
    }

    return URL.createObjectURL(coverFile);
  }, [coverFile]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      synopsis: "",
      cover: undefined,
      author: "",
      year: 1,
    },
  });

  function onSubmit(data) {
    console.log(data);
  }

  useEffect(() => {
    if (!coverPreview) {
      return;
    }

    return () => URL.revokeObjectURL(coverPreview);
  }, [coverPreview]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="book-title">Nama Buku</FieldLabel>
              <FieldContent>
                <input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className="form-control h-8"
                  id="book-title"
                  placeholder="Nama Buku"
                  type="text"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="cover"
          render={({
            field: { value: _value, onChange, ...field },
            fieldState,
          }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="book-cover">Upload Sampul Buku</FieldLabel>
              <FieldContent>
                <input
                  {...field}
                  accept="image/*"
                  className="sr-only"
                  id="book-cover"
                  type="file"
                  value={undefined}
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    setCoverFile(file ?? null);
                    onChange(file ?? undefined);
                  }}
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
                          {coverFile?.name}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="author"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="book-author">Pengarang</FieldLabel>
              <FieldContent>
                <input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className="form-control h-8"
                  id="book-author"
                  type="text"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="year"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="book-year">Tahun Baca</FieldLabel>
              <FieldContent>
                <input
                  className="form-control h-8 max-w-30"
                  id="book-year"
                  type="text"
                  aria-invalid={fieldState.invalid}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      field.onChange(undefined);
                    } else {
                      field.onChange(Number(raw));
                    }
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />

        <div className="flex items-center gap-4 pt-1">
          <Button
            className="h-8 flex-1 rounded-md bg-primary-accent text-xs font-semibold normal-case tracking-normal text-white hover:bg-hover-accent"
            type="submit"
          >
            <Plus className="size-4" />
            Tambah Buku
          </Button>
          <DrawerClose asChild>
            <button
              className="h-8 px-2 text-13 font-medium text-secondary-text transition-colors hover:text-primary-text"
              type="button"
            >
              Batal
            </button>
          </DrawerClose>
        </div>
      </FieldGroup>
    </form>
  );
}
