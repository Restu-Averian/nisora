import { Button } from "@/components/ui/button";
import { TABS } from "@/data/books";
import { isEmptyValue } from "@/js-toolkit/src";
import {
  BookOpen,
  CalendarDays,
  LoaderCircle,
  LogIn,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

const actionButtonClassName =
  "mt-auto h-12 w-full gap-3 rounded-lg bg-primary-accent px-4 text-sm font-semibold normal-case tracking-normal text-white shadow-inset-button hover:bg-hover-accent";
const statusIconClassName = "size-5";

function BookMeta({ icon: Icon, label, value }) {
  return (
    <div className="book-card__meta">
      <span className="book-card__meta-icon">
        <Icon />
      </span>

      <div className="book-card__meta-text">
        <p className="book-card__meta-label">{label}</p>
        <p className="book-card__meta-value">{value}</p>
      </div>
    </div>
  );
}

export default function BookCard({ book, onClick, onStatusChange }) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { btnText, newStatusValue } = useMemo(() => {
    const newStatusValue = book?.status === "finished" ? "reading" : "finished";

    if (isUpdatingStatus) {
      return {
        btnText: "Memindahkan...",
        newStatusValue,
      };
    }

    const nextStatusLabel = TABS?.find(
      (tab) => tab?.value === newStatusValue,
    )?.label;

    const statusText = nextStatusLabel;

    if (isEmptyValue(statusText)) {
      return {
        btnText: "Update status",
        newStatusValue,
      };
    }

    return {
      btnText: `Pindahkan ke ${statusText}`,
      newStatusValue,
    };
  }, [book?.status, isUpdatingStatus]);

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

          <div className="book-card__meta-list">
            <BookMeta icon={BookOpen} label="Sinopsis" value={book.synopsis} />
            <BookMeta icon={UserRound} label="Pengarang" value={book.author} />

            <div className="book-card__year-row">
              <span className="book-card__meta-icon">
                <CalendarDays />
              </span>

              <span className="book-card__year-label">Tahun</span>
              <span className="book-card__year">{book.year}</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        className={actionButtonClassName}
        disabled={isUpdatingStatus || !onStatusChange}
        onClick={handleStatusChange}
        type="button"
      >
        {isUpdatingStatus && (
          <LoaderCircle className={`${statusIconClassName} animate-spin`} />
        )}
        {!isUpdatingStatus && <LogIn className={statusIconClassName} />}

        {btnText}
      </Button>
    </article>
  );
}
