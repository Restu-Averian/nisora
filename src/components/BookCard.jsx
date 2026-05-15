import { Button } from "@/components/ui/button";

function BookMeta({ label, value }) {
  return (
    <div className="mt-2">
      <p className="text-xs font-bold leading-tight text-primary-text">
        {label}
      </p>
      <p className="line-clamp-3 text-xxs leading-tight text-primary-text">
        {value}
      </p>
    </div>
  );
}

export function BookCard({ book }) {
  return (
    <article className="rounded-lg border border-border bg-background/72 p-3 shadow-card">
      <div className="grid grid-cols-[92px_1fr] gap-3">
        <img
          alt={`Sampul ${book.title}`}
          className="h-35.5 w-23 rounded-md object-cover shadow-cover"
          src={book.cover}
          loading="lazy"
        />

        <div className="min-w-0 pt-1">
          <h2 className="font-heading text-lg font-bold leading-tight text-primary-text">
            {book.title}
          </h2>

          <BookMeta label="Sinopsis" value={book.synopsis} />
          <BookMeta label="Pengarang" value={book.author} />

          <span className="mt-2 inline-flex h-6 items-center rounded bg-soft-accent px-2 text-xxs font-bold uppercase leading-none text-primary-text">
            Tahun: {book.year}
          </span>
        </div>
      </div>

      <Button
        className="mt-3 h-8 w-full rounded-md bg-primary-accent px-3 text-xs font-semibold normal-case tracking-normal text-white shadow-inset-button hover:bg-hover-accent"
        type="button"
      >
        [ Pindahkan ke '{book.status}' ]
      </Button>
    </article>
  );
}
