import BooksTabs from "./components/list/books-tabs";
import BookGrid from "./components/list/book-grid";
import BookSearch from "./components/list/book-search";
import FormBookDrawer from "../form";

export default function ListBooks({ refreshKey, setBooksRefreshKey }) {
  return (
    <section className="books-collection">
      <div className="books-collection__controls">
        <BooksTabs />

        <div className="books-collection__actions">
          <BookSearch />
          <FormBookDrawer setBooksRefreshKey={setBooksRefreshKey} />
        </div>
      </div>

      <BookGrid refreshKey={refreshKey} />
    </section>
  );
}
