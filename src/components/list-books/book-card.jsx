import { Button } from "@/components/ui/button";
import { TABS } from "@/data/books";
import { useMemo } from "react";

function BookMeta({ label, value }) {
  return (
    <div className="book-card__meta">
      <p className="book-card__meta-label">{label}</p>
      <p className="book-card__meta-value">{value}</p>
    </div>
  );
}

export default function BookCard({ book, onClick }) {
  const statusText = useMemo(() => {
    return TABS?.find((tab) => tab?.value === book?.status)?.label;
  }, [book?.status, TABS]);

  return (
    <article
      className="book-card"
      onClick={onClick}
    >
      <div className="book-card__layout">
        <img
          alt={`Sampul ${book.title}`}
          className="book-card__cover"
          src={book.cover}
          loading="lazy"
        />

        <div className="book-card__content">
          <h2 className="book-card__title">{book.title}</h2>

          <BookMeta label="Sinopsis" value={book.synopsis} />
          <BookMeta label="Pengarang" value={book.author} />

          <span className="book-card__year">
            Tahun: {book.year}
          </span>
        </div>
      </div>

      <Button
        className="book-card__action"
        onClick={(event) => {
          event.stopPropagation();
        }}
        type="button"
      >
        Pindahkan ke <span className="book-card__action-status">{statusText}</span>
      </Button>
    </article>
  );
}
