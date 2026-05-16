import { Search } from "lucide-react";
import { Field, FieldContent } from "../ui/field";

export default function InputSearch() {
  return (
    <Field className="gap-1.5 flex-1 ">
      <FieldContent className="relative ml-auto" style={{ width: 360 }}>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          className="form-control h-8 pl-9 ml-auto "
          id="search-book"
          placeholder="Cari Koleksi"
          type="text"
        />
      </FieldContent>
    </Field>
  );
}
