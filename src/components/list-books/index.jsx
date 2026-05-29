import BooksTabs from "./books-tabs";
import BookGrid from "./book-grid";

export default function ListBooks({ refreshKey }) {
  return (
    <>
      <BooksTabs />
      <BookGrid refreshKey={refreshKey} />
    </>
  );
}
