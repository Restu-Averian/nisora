import { Controller } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { LoaderCircle } from "lucide-react";

const searchItemClassName = "items-start";
const searchListClassName = "mt-2 rounded-md border border-border bg-background";
const floatingSearchListClassName =
  "absolute left-0 right-0 top-full z-20 shadow-sidebar";
const loadingItemClassName = "flex items-center justify-between";
const commandClassName =
  "relative overflow-visible rounded-md bg-transparent text-primary-text";
const commandInputClassName = "h-8";

function BookSearchItem({ book, onBookSelect }) {
  return (
    <CommandItem
      className={searchItemClassName}
      value={book.title}
      onSelect={() => {
        onBookSelect(book);
      }}
    >
      {book.cover ? (
        <img
          alt={`Sampul ${book.title}`}
          className="book-search-item__cover"
          src={book.cover}
          loading="lazy"
        />
      ) : (
        <span className="book-search-item__empty-cover">
          No Cover
        </span>
      )}

      <span className="book-search-item__text">
        <span className="book-search-item__title">{book.title}</span>

        {(book.author || book.year) && (
          <span className="book-search-item__meta">
            {[book.author, book.year].filter(Boolean).join(" · ")}
          </span>
        )}
      </span>
    </CommandItem>
  );
}

function BookSearchLists({ bookSearch, isMobile, onBookSelect, title }) {
  const notFoundSearch =
    !bookSearch.isSearching &&
    !bookSearch.error &&
    bookSearch.hasSearched &&
    bookSearch.results.length === 0;

  return (
    <CommandList
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      className={
        isMobile
          ? searchListClassName
          : `${searchListClassName} ${floatingSearchListClassName}`
      }
    >
      {title?.trim().length < 2 && (
        <CommandItem disabled>
          Ketik minimal 2 huruf untuk mencari buku.
        </CommandItem>
      )}

      {bookSearch.isSearching && (
        <CommandItem
          disabled
          className={loadingItemClassName}
          showCheckIcon={false}
        >
          <p className="book-search-list__loading-text">Mencari buku...</p>

          <LoaderCircle className="book-search-list__loading-icon" />
        </CommandItem>
      )}

      {bookSearch.error && (
        <CommandItem disabled>{bookSearch.error}</CommandItem>
      )}

      {notFoundSearch && (
        <CommandEmpty className="px-4 text-secondary-text">
          Buku tidak ditemukan. Input ini akan menjadi data baru.
        </CommandEmpty>
      )}

      {bookSearch.results.length > 0 && (
        <CommandGroup heading="Hasil pencarian">
          {bookSearch.results.map((book) => (
            <BookSearchItem
              book={book}
              key={book.id}
              onBookSelect={onBookSelect}
            />
          ))}
        </CommandGroup>
      )}
    </CommandList>
  );
}

export function BookTitleField({
  bookSearch,
  control,
  isMobile,
  onBookSelect,
  onResetSearch,
  onSearch,
}) {
  return (
    <Controller
      control={control}
      name="title"
      render={({ field, fieldState }) => (
        <Field className="book-form__field" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="book-title">Nama Buku</FieldLabel>

          <FieldContent>
            <Command className={commandClassName} shouldFilter={false}>
              <CommandInput
                id="book-title"
                aria-invalid={fieldState.invalid}
                className={commandInputClassName}
                name={field.name}
                placeholder="Nama Buku"
                value={field.value}
                onBlur={field.onBlur}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    onResetSearch();
                  }
                }}
                onValueChange={(value) => {
                  field.onChange(value);
                  onSearch(value);
                }}
              />
              {bookSearch.showResults && (
                <BookSearchLists
                  bookSearch={bookSearch}
                  isMobile={isMobile}
                  title={field.value}
                  onBookSelect={onBookSelect}
                />
              )}
            </Command>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
