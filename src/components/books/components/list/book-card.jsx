import { Button } from "@/components/ui/button";
import { TABS } from "@/data/books";
import { isEmptyValue } from "@/js-toolkit/src";
import { LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";

function BookMeta({ label, value }) {
  return (
    <div className="book-card__meta">
      <p className="book-card__meta-label">{label}</p>
      <p className="book-card__meta-value">{value}</p>
    </div>
  );
}

export default function BookCard({ book, onClick, onStatusChange }) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { btnText, newStatusValue } = useMemo(() => {
    const newStatusValue = book?.status === "finished" ? "reading" : "finished";

    const nextStatusLabel = TABS?.find(
      (tab) => tab?.value === newStatusValue,
    )?.label;

    const statusText = isUpdatingStatus ? "" : nextStatusLabel;

    if (isEmptyValue(statusText)) {
      return {
        btnText: "Update status",
        newStatusValue,
      };
    }

    return {
      btnText: `${isUpdatingStatus ? "Memindahkan..." : "Pindahkan ke"} ${statusText}`,
      newStatusValue,
    };
  }, [isUpdatingStatus]);

  const handleStatusChange = async (event) => {
    event.stopPropagation();

    setIsUpdatingStatus(true);

    try {
      await onStatusChange?.(book, newStatusValue);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <article className="book-card" onClick={onClick}>
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

          <span className="book-card__year">Tahun: {book.year}</span>
        </div>
      </div>

      <Button
        className="book-card__action"
        disabled={isUpdatingStatus || !onStatusChange}
        onClick={handleStatusChange}
        type="button"
      >
        {isUpdatingStatus && <LoaderCircle className="animate-spin" />}

        {btnText}
      </Button>
    </article>
  );
}
