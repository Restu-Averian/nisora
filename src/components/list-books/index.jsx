import { books } from "@/data/books";
import BooksTabs from "./books-tabs";
import BookGrid from "./book-grid";

export default function ListBooks() {
  return (
    <>
      <BooksTabs />
      <BookGrid books={books} />
    </>
  );
}
