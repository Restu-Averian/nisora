import BooksTabs from "./components/list/books-tabs";
import BookGrid from "./components/list/book-grid";

export default function ListBooks({ refreshKey }) {
  return (
    <>
      <BooksTabs />
      <BookGrid refreshKey={refreshKey} />
    </>
  );
}
