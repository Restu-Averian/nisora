import { Loader2, Search } from "lucide-react";
import { Field, FieldContent } from "@/components/ui/field";
import { useBreakpoint } from "@/js-toolkit/src/react";
import useBooksStore from "@/store/booksStore";
import { useShallow } from "zustand/shallow";

export default function BookSearch() {
  const { xs } = useBreakpoint();
  const { searchValue, setSearchValue, isSearching } = useBooksStore(
    useShallow((state) => {
      return {
        searchValue: state.searchValue,
        setSearchValue: state.setSearchValue,
        isSearching: state.isSearching,
      };
    }),
  );

  return (
    <Field className="books-search">
      <FieldContent
        className="books-search__content"
        style={{ width: xs ? "100%" : 360 }}
      >
        {isSearching ? (
          <Loader2 className="books-search__icon animate-spin" />
        ) : (
          <Search className="books-search__icon" />
        )}

        <input
          className="form-control books-search__input"
          id="search-book"
          onChange={({ target }) => {
            setSearchValue(target.value);
          }}
          placeholder="Cari Koleksi"
          type="text"
          value={searchValue}
        />
      </FieldContent>
    </Field>
  );
}
