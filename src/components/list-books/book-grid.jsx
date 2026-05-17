import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TabsContent } from "@/components/ui/tabs";
import { TABS } from "@/data/books";
import BookCard from "./book-card";
import BookDetail from "./book-detail";
import { objKeys } from "@/js-toolkit/src";

export default function BookGrid({ books }) {
  const [selectedBook, setSelectedBook] = useState({});

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
              return (
                <BookCard
                  book={book}
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                  }}
                />
              );
            })}
          </TabsContent>
        );
      })}

      <Dialog
        open={objKeys(selectedBook)?.length > 0}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBook({});
          }
        }}
      >
        <DialogContent className="max-h-[calc(100vh-3rem)] w-[min(1160px,calc(100%-2rem))] max-w-[min(1160px,calc(100%-2rem))] gap-0 overflow-y-auto p-0 sm:max-w-[min(1160px,calc(100%-2rem))]">
          <DialogHeader className="border-b border-border px-6 py-7 text-center">
            <DialogTitle className="font-heading font-bold normal-case tracking-normal text-primary-text">
              Detail Buku
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detail buku yang dipilih dari koleksi.
            </DialogDescription>
          </DialogHeader>

          <BookDetail book={selectedBook} />
        </DialogContent>
      </Dialog>
    </>
  );
}
