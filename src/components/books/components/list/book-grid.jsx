import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { decryptStoredUserCookie, isEmptyValue } from "@/js-toolkit/src";
import { useBreakpoint } from "@/js-toolkit/src/react";
import supabase from "@/lib/supabase";
import useBooksStore, { mapBookFromSupabase } from "@/store/booksStore";
import { useShallow } from "zustand/shallow";
import BookDetail from "../detail";
import BookCard from "./book-card";
import BookLoginRequired from "./book-login-required";
import BookListNotFound from "./book-list-not-found";

const detailDrawerTitleClassName =
  "font-heading font-bold normal-case tracking-normal text-primary-text";
const detailDialogContentClassName =
  "max-h-[calc(100vh-3rem)] w-[min(1160px,calc(100%-2rem))] max-w-[min(1160px,calc(100%-2rem))] gap-0 overflow-y-auto rounded-3xl border border-white/70 bg-[#fffaf4] p-0 shadow-[0_24px_80px_rgba(47,35,24,0.24)] sm:max-w-[min(1160px,calc(100%-2rem))]";
const detailDialogHeaderClassName = "border-b-0 px-6 pt-7 pb-0 text-center";

export default function BookGrid({ refreshKey }) {
  const {
    books,
    isFetchingBooks,
    searchValue,
    fetchBooks,
    clearBooks,
    updateBookStatus,
    setIsSearching,
  } = useBooksStore(
    useShallow((state) => {
      return {
        books: state?.books,
        isFetchingBooks: state?.isFetchingBooks,
        searchValue: state?.searchValue,
        fetchBooks: state?.fetchBooks,
        clearBooks: state?.clearBooks,
        updateBookStatus: state?.updateBookStatus,
        setIsSearching: state?.setIsSearching,
      };
    }),
  );

  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(decryptStoredUserCookie(supabase));
  });
  const initRefreshKeyRef = useRef(refreshKey);

  const { xs } = useBreakpoint();

  const toastPosition = useMemo(() => (xs ? "top-center" : "top-right"), [xs]);

  const [searchedBooks, setSearchedBooks] = useState(books || []);
  useEffect(() => {
    const search = searchValue?.trim();

    if (isEmptyValue(search)) {
      queueMicrotask(() => {
        setSearchedBooks(books || []);
      });
      return;
    }

    const fetchSearch = async () => {
      setIsSearching(true);
      
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setSearchedBooks([]);
        setIsSearching(false);
        return;
      }

      const { data, error } = await supabase
        .from("books")
        .select(
          "id,title,authors,synopsis,published_year,cover_url,status,personal_note,created_at",
        )
        .eq("user_id", session.user.id)
        .or(`title.ilike.%${search}%,synopsis.ilike.%${search}%`)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Gagal mencari buku", {
          description: error?.message,
          position: toastPosition,
        });
      } else {
        setSearchedBooks((data || []).map(mapBookFromSupabase));
      }

      setIsSearching(false);
    };

    const timeoutId = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [books, searchValue, toastPosition]);

  const selectedBook = useMemo(() => {
    if (!selectedBookId) {
      return null;
    }

    return (
      (books || []).find((book) => {
        return book.id === selectedBookId;
      }) ?? null
    );
  }, [books, selectedBookId]);

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
      if (!book?.id) {
        toast.error("Gagal mengubah status buku", {
          description: "Data buku tidak lengkap.",
          position: toastPosition,
        });
        return;
      }

      if (typeof updateBookStatus !== "function") {
        toast.error("Gagal mengubah status buku", {
          description: "Aksi pembaruan status tidak tersedia.",
          position: toastPosition,
        });
        return;
      }

      const statusLabel =
        TABS.find((tab) => tab.value === newStatusValue)?.label ??
        "status baru";

      try {
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

        toast.success("Status buku diperbarui", {
          description: `Buku dipindahkan ke ${statusLabel}.`,
          position: toastPosition,
        });
      } catch (error) {
        toast.error("Gagal mengubah status buku", {
          description:
            error instanceof Error ? error.message : "Terjadi kesalahan.",
          position: toastPosition,
        });
      }
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));

      if (!session) {
        clearBooks();
        setSelectedBookId(null);
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
                      setSelectedBookId(book.id);
                    }}
                    onStatusChange={onUpdateBookStatus}
                  />
                );
              })
            ) : (
              <div className="books-grid__empty sm:col-span-2 xl:col-span-3">
                {!isAuthenticated ? (
                  <BookLoginRequired />
                ) : isEmptyValue(searchValue?.trim()) ? (
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
          open={Boolean(selectedBook)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedBookId(null);
            }
          }}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className={detailDrawerTitleClassName}>
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
          open={Boolean(selectedBook)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedBookId(null);
            }
          }}
        >
          <DialogContent className={detailDialogContentClassName}>
            <DialogHeader className={detailDialogHeaderClassName}>
              <DialogTitle className={detailDrawerTitleClassName}>
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
