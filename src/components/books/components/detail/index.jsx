import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { TABS } from "@/data/books";
import { Pencil } from "lucide-react";

export default function BookDetail({ book }) {
  const statusText = useMemo(() => {
    return TABS.find((tab) => tab.value === book?.status)?.label ?? "-";
  }, [book?.status]);

  if (!book) {
    return null;
  }

  return (
    <section className="book-detail md:overflow-y-visible">
      <div className="book-detail__layout md:grid-cols-[330px_1fr] md:p-8">
        <img
          alt={`Sampul ${book.title}`}
          className="book-detail__cover"
          src={book.cover}
        />

        <div className="book-detail__content">
          <div>
            <span className="book-detail__status">{statusText}</span>

            <div className="book-detail__headline">
              <div>
                <h2 className="book-detail__title">{book.title}</h2>
                <p className="book-detail__author">{book.author}</p>
              </div>

              <span className="book-detail__year">Tahun: {book.year}</span>
            </div>
          </div>

          <div className="book-detail__synopsis">
            <h3 className="book-detail__section-title">Sinopsis</h3>
            <p className="book-detail__synopsis-text">{book.synopsis}</p>
          </div>

          <div className="book-detail__note">
            <label
              className="book-detail__note-label"
              htmlFor={`book-note-${book.id}`}
            >
              Catatan Pribadi
            </label>
            <div className="book-detail__note-control">
              <textarea
                className="book-detail__note-input"
                id={`book-note-${book.id}`}
                placeholder="Tambahkan catatan Anda di sini..."
              />
              <Button className="book-detail__note-action" type="button">
                <Pencil />
              </Button>
            </div>
          </div>

          <div className="book-detail__actions sm:grid-cols-3">
            <Button className="book-detail__delete" type="button">
              Delete
            </Button>
            <Button
              className="book-detail__update"
              type="button"
              variant="outline"
            >
              Update
            </Button>
            <Button className="book-detail__status-action" type="button">
              Update status '{statusText}'
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
