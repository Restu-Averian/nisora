import { Loader2, Search } from "lucide-react";
import { Field, FieldContent } from "@/components/ui/field";
import useBooksStore from "@/store/booksStore";
import { useShallow } from "zustand/shallow";

const searchFieldClassName =
  "min-w-0 w-full gap-1.5 sm:flex-1 md:w-[calc(100%-200px)] md:flex-none xl:w-80";
const searchContentClassName = "relative w-full";
const searchIconClassName =
  "pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground";
const searchInputClassName =
  "form-control h-12 w-full rounded-lg border-border bg-background/85 pl-12 text-base shadow-[0_6px_18px_rgba(70,55,35,0.08)] placeholder:text-secondary-text";

export default function BookSearch() {
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
    <Field className={searchFieldClassName}>
      <FieldContent className={searchContentClassName}>
        {isSearching ? (
          <Loader2 className={`${searchIconClassName} animate-spin`} />
        ) : (
          <Search className={searchIconClassName} />
        )}

        <input
          className={searchInputClassName}
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
