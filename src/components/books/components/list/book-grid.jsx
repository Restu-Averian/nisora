import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Fzf } from "fzf";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { TabsContent } from "@/components/ui/tabs";
import { TABS } from "@/data/books";
import { isEmptyValue, objKeys, toLowerCase } from "@/js-toolkit/src";
import { useBreakpoint } from "@/js-toolkit/src/react";
import supabase from "@/lib/supabase";
import useBooksStore from "@/store/booksStore";
import { useShallow } from "zustand/shallow";
import BookDetail from "../detail";
import BookCard from "./book-card";
import BookListNotFound from "./book-list-not-found";

function getBookSearchText(book) {
  const statusLabel =
    TABS.find((tab) => tab.value === book?.status)?.label ?? book?.status;

  return [book?.title, book?.author, book?.synopsis, book?.year, statusLabel]
    .filter(Boolean)
    .join(" ");
}

export default function BookGrid({ refreshKey }) {
  const {
    books,
    isFetchingBooks,
    searchValue,
    fetchBooks,
    clearBooks,
    updateBookStatus,
  } = useBooksStore(
    useShallow((state) => {
      return {
        books: state?.books,
        isFetchingBooks: state?.isFetchingBooks,
        searchValue: state?.searchValue,
        fetchBooks: state?.fetchBooks,
        clearBooks: state?.clearBooks,
        updateBookStatus: state?.updateBookStatus,
      };
    }),
  );

  const [selectedBook, setSelectedBook] = useState({});
  const initRefreshKeyRef = useRef(refreshKey);

  const { xs } = useBreakpoint();

  const toastPosition = useMemo(() => (xs ? "top-center" : "top-right"), [xs]);

  const fzfBooks = useMemo(() => {
    return new Fzf(books || [], {
      casing: "case-insensitive",
      selector: getBookSearchText,
    });
  }, [books]);

  const searchedBooks = useMemo(() => {
    const search = toLowerCase(searchValue)?.trim() || "";

    if (isEmptyValue(search)) {
      return books;
    }

    return (
      fzfBooks.find(search)?.map((result) => {
        return {
          ...result?.item,
          positions: result?.positions || null,
        };
      }) || []
    );
  }, [books, fzfBooks, searchValue]);

  const onShowToastError = useCallback(
    ({ error }) => {
      if (error) {
        toast.error("Gagal memuat buku", {
          description: error?.message,
          position: toastPosition,
        });
      }
    },
    [toastPosition],
  );

  const onUpdateBookStatus = useCallback(
    async (book, newStatusValue) => {
      const statusLabel = TABS.find(
        (tab) => tab.value === newStatusValue,
      )?.label;

      const { error } = await updateBookStatus({
        bookId: book.id,
        newStatusValue,
      });

      if (error) {
        toast.error("Gagal mengubah status buku", {
          description: error?.message,
          position: toastPosition,
        });
        return;
      }

      setSelectedBook((currentBook) => {
        if (currentBook?.id !== book.id) {
          return currentBook;
        }

        return {
          ...currentBook,
          status: newStatusValue,
        };
      });

      toast.success("Status buku diperbarui", {
        description: `Buku dipindahkan ke ${statusLabel}.`,
        position: toastPosition,
      });
    },
    [toastPosition, updateBookStatus],
  );

  useEffect(() => {
    if (refreshKey === initRefreshKeyRef.current) {
      return;
    }

    fetchBooks().then((res) => onShowToastError(res));
  }, [fetchBooks, refreshKey, onShowToastError]);

  useEffect(() => {
    if (!selectedBook?.id) {
      return;
    }

    const isSelectedBookAvailable = books.some((book) => {
      return book.id === selectedBook.id;
    });

    if (!isSelectedBookAvailable) {
      setSelectedBook({});
    }
  }, [books, selectedBook?.id]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        clearBooks();
        setSelectedBook({});
        return;
      }

      fetchBooks(session.user.id).then((res) => onShowToastError(res));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clearBooks, fetchBooks, onShowToastError]);

  if (isFetchingBooks) {
    return (
      <TabsContent className="books-grid__loading" value="all">
        Memuat buku...
      </TabsContent>
    );
  }

  return (
    <>
      {TABS.map((tab) => {
        const filteredBooks =
          tab?.value === "all"
            ? searchedBooks
            : searchedBooks?.filter((book) => {
                return book?.status === tab?.value;
              });

        return (
          <TabsContent
            className="books-grid__list sm:grid-cols-2 xl:grid-cols-3"
            key={tab?.value}
            value={tab?.value}
          >
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => {
                return (
                  <BookCard
                    book={book}
                    key={book.id}
                    onClick={() => {
                      setSelectedBook(book);
                    }}
                    onStatusChange={onUpdateBookStatus}
                  />
                );
              })
            ) : (
              <div className="books-grid__empty sm:col-span-2 xl:col-span-3">
                {isEmptyValue(searchValue?.trim()) ? (
                  <BookListNotFound />
                ) : (
                  "Buku tidak ditemukan."
                )}
              </div>
            )}
          </TabsContent>
        );
      })}

      {xs ? (
        <Drawer
          open={objKeys(selectedBook)?.length > 0}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedBook({});
            }
          }}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="books-grid__drawer-title">
                Detail Buku
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                Detail buku yang dipilih dari koleksi.
              </DrawerDescription>
            </DrawerHeader>

            <BookDetail book={selectedBook} />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog
          open={objKeys(selectedBook)?.length > 0}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedBook({});
            }
          }}
        >
          <DialogContent className="books-grid__dialog-content sm:max-w-[min(1160px,calc(100%-2rem))]">
            <DialogHeader className="books-grid__dialog-header">
              <DialogTitle className="books-grid__dialog-title">
                Detail Buku
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detail buku yang dipilih dari koleksi.
              </DialogDescription>
            </DialogHeader>

            <BookDetail book={selectedBook} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
