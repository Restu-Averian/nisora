import { Search } from "lucide-react";
import { Field, FieldContent } from "../ui/field";
import { useBreakpoint } from "@/js-toolkit/src/react";

export default function InputSearch() {
  const { xs } = useBreakpoint();
  return (
    <Field className="books-search">
      <FieldContent
        className="books-search__content"
        style={{ width: xs ? "100%" : 360 }}
      >
        <Search className="books-search__icon" />

        <input
          className="form-control books-search__input"
          id="search-book"
          placeholder="Cari Koleksi"
          type="text"
        />
      </FieldContent>
    </Field>
  );
}
