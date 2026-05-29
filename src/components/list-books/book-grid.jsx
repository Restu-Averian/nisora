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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

const FALLBACK_COVER_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDd23Au450NaCV6pADO2wJxLkN0oic3qktA&s";

function mapBookFromSupabase(book) {
  return {
    id: book.id,
    title: book.title,
    synopsis: book.synopsis ?? "-",
    author: book.authors?.join(", ") || "-",
    year: book.published_year ?? "-",
    status: book.status,
    cover: book.cover_url || FALLBACK_COVER_URL,
  };
}

export default function BookGrid({ refreshKey }) {
  const [books, setBooks] = useState([]);
  const [isFetchingBooks, setIsFetchingBooks] = useState(true);
  const [selectedBook, setSelectedBook] = useState({});
  const authRequestIdRef = useRef(0);
  const initRefreshKeyRef = useRef(refreshKey);

  const { xs } = useBreakpoint();

  const toastPosition = useMemo(() => (xs ? "top-center" : "top-right"), [xs]);

  const updateBooks = useCallback(
    ({ books: loadedBooks, error }) => {
      if (error) {
        toast.error("Gagal memuat buku", {
          description: error.message,
          position: toastPosition,
        });
      }

      setBooks(loadedBooks);
      setIsFetchingBooks(false);
    },
    [toastPosition],
  );

  async function loadBooksByUserId(userId) {
    const { data, error } = await supabase
      .from("books")
      .select(
        "id,title,authors,synopsis,published_year,cover_url,status,created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return {
      books: (data ?? []).map((book) => mapBookFromSupabase(book)),
      error,
    };
  }

  async function loadBooks(userId) {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { books: [], error: sessionError };
    }

    if (userId) {
      return loadBooksByUserId(userId);
    }

    return loadBooksByUserId(session?.user?.id);
  }

  useEffect(() => {
    if (refreshKey === initRefreshKeyRef.current) {
      return;
    }

    loadBooks().then(updateBooks);
  }, [refreshKey, updateBooks]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setBooks([]);
        setSelectedBook({});
        setIsFetchingBooks(false);
        return;
      }

      const requestId = authRequestIdRef.current + 1;
      authRequestIdRef.current = requestId;

      loadBooks(session.user.id).then(({ books: loadedBooks, error }) => {
        if (authRequestIdRef.current !== requestId) {
          return;
        }

        updateBooks({ books: loadedBooks, error });
      });
    });

    return () => {
      authRequestIdRef.current += 1;
      subscription.unsubscribe();
    };
  }, [updateBooks]);

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
