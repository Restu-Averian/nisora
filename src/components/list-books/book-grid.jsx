import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

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
import { useBreakpoint } from "@/js-toolkit/src/react";
import supabase from "@/lib/supabase";
import useBooksStore from "@/store/booksStore";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useShallow } from "zustand/shallow";

export default function BookGrid({ refreshKey }) {
  const { books, isFetchingBooks, fetchBooks, clearBooks } = useBooksStore(
    useShallow((state) => {
      return {
        books: state?.books,
        isFetchingBooks: state?.isFetchingBooks,
        fetchBooks: state?.fetchBooks,
        clearBooks: state?.clearBooks,
      };
    }),
  );

  const [selectedBook, setSelectedBook] = useState({});
  const initRefreshKeyRef = useRef(refreshKey);

  const { xs } = useBreakpoint();

  const toastPosition = useMemo(() => (xs ? "top-center" : "top-right"), [xs]);

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

  useEffect(() => {
    if (refreshKey === initRefreshKeyRef.current) {
      return;
    }

    fetchBooks().then((res) => onShowToastError(res));
  }, [fetchBooks, refreshKey, onShowToastError]);

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
      <TabsContent
        className="rounded-md border border-border bg-background/72 p-6 text-center text-sm font-medium text-secondary-text"
        value="all"
      >
        Memuat buku...
      </TabsContent>
    );
  }

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
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => {
                return (
                  <BookCard
                    book={book}
                    key={book.id}
                    onClick={() => {
                      setSelectedBook(book);
                    }}
                  />
                );
              })
            ) : (
              <div className="rounded-md border border-border bg-background/72 p-6 text-center text-sm font-medium text-secondary-text sm:col-span-2 xl:col-span-3">
                Belum ada buku.
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
              <DrawerTitle className="font-heading font-bold normal-case tracking-normal text-primary-text">
                Detail Buku
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                Detail buku yang dipilih dari koleksi.
              </DrawerDescription>
            </DrawerHeader>

            <BookDetail book={selectedBook}>{() => {}}</BookDetail>
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
      )}
    </>
  );
}
