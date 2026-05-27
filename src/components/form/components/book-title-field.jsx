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

function BookSearchItem({ book, onBookSelect }) {
  return (
    <CommandItem
      className="items-start"
      value={book.title}
      onSelect={() => {
        onBookSelect(book);
      }}
    >
      {book.cover ? (
        <img
          alt={`Sampul ${book.title}`}
          className="h-14 w-10 rounded object-cover shadow-cover"
          src={book.cover}
          loading="lazy"
        />
      ) : (
        <span className="flex h-14 w-10 shrink-0 items-center justify-center rounded bg-surface text-xxs text-secondary-text shadow-cover">
          No Cover
        </span>
      )}

      <span className="min-w-0 text-left">
        <span className="block truncate font-semibold text-primary-text">
          {book.title}
        </span>

        {(book.author || book.year) && (
          <span className="block truncate text-xs text-secondary-text">
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
          ? "mt-2 rounded-md border border-border bg-background"
          : "absolute left-0 right-0 top-full z-20 mt-2 rounded-md border border-border bg-background shadow-sidebar"
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
          className="flex justify-between items-center"
          showCheckIcon={false}
        >
          <p className="flex-1">Mencari buku...</p>

          <LoaderCircle className="animate-spin" />
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
        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="book-title">Nama Buku</FieldLabel>

          <FieldContent>
            <Command
              className="relative overflow-visible rounded-md bg-transparent text-primary-text"
              shouldFilter={false}
            >
              <CommandInput
                id="book-title"
                aria-invalid={fieldState.invalid}
                className="h-8"
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
