import { TabsContent } from "@/components/ui/tabs";
import { TABS } from "@/data/books";
import BookCard from "./book-card";

export default function BookGrid({ books }) {
  return (
    <>
      {TABS.map((tab) => {
        const filteredBooks =
          tab?.value === "all"
            ? books
            : books?.filter((book) => {
                return book?.status === tab?.value;
              });

        return (
          <TabsContent
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            key={tab?.value}
            value={tab?.value}
          >
            {filteredBooks.map((book) => {
              return <BookCard book={book} key={book.id} />;
            })}
          </TabsContent>
        );
      })}
    </>
  );
}
