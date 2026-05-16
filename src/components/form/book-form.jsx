import { useEffect, useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function BookForm() {
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  function handleCoverChange(event) {
    const file = event.target.files?.[0];
    setCoverFile(file ?? null);
  }

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(coverFile);
    setCoverPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [coverFile]);

  return (
    <form>
      <FieldGroup className="gap-4">
        <Field className="gap-1.5">
          <FieldLabel htmlFor="book-title"> Nama Buku </FieldLabel>
          <FieldContent>
            <input
              className="form-control h-8"
              id="book-title"
              placeholder="Nama Buku"
              type="text"
            />
          </FieldContent>
        </Field>

        <Field className="gap-1.5">
          <FieldLabel htmlFor="book-synopsis">Sinopsis</FieldLabel>
          <FieldContent>
            <textarea
              className="form-control min-h-textarea resize-none py-2"
              id="book-synopsis"
              placeholder="Sinopsis"
            />
          </FieldContent>
        </Field>

        <Field className="gap-1.5">
          <FieldLabel htmlFor="book-cover">Upload Sampul Buku</FieldLabel>
          <FieldContent>
            <input
              accept="image/*"
              className="sr-only"
              id="book-cover"
              onChange={handleCoverChange}
              type="file"
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
                      {coverFile.name}
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
          </FieldContent>
        </Field>

        <Field className="gap-1.5">
          <FieldLabel htmlFor="book-author">Pengarang</FieldLabel>
          <FieldContent>
            <input className="form-control h-8" id="book-author" type="text" />
          </FieldContent>
        </Field>

        <Field className="gap-1.5">
          <FieldLabel htmlFor="book-year">Tahun Baca</FieldLabel>
          <FieldContent>
            <input
              className="form-control h-8 max-w-30"
              defaultValue="1"
              id="book-year"
              type="text"
            />
          </FieldContent>
        </Field>

        <div className="flex items-center gap-4 pt-1">
          <Button
            className="h-8 flex-1 rounded-md bg-primary-accent text-xs font-semibold normal-case tracking-normal text-white hover:bg-hover-accent"
            type="button"
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
