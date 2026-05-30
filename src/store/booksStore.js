import { create } from "zustand";
import supabase from "@/lib/supabase";

const FALLBACK_COVER_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDd23Au450NaCV6pADO2wJxLkN0oic3qktA&s";

const booksRequest = {
  current: 0,
};

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

const booksStore = create((set) => {
  return {
    books: [],
    isFetchingBooks: true,

    clearBooks() {
      set({
        books: [],
        isFetchingBooks: false,
      });
    },

    async fetchBooks(userId) {
      const requestId = booksRequest.current + 1;
      booksRequest.current = requestId;

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        if (booksRequest.current === requestId) {
          set({
            books: [],
            isFetchingBooks: false,
          });
        }

        return { books: [], error: sessionError };
      }

      const result = await loadBooksByUserId(userId || session?.user?.id);

      if (booksRequest.current === requestId) {
        set({
          books: result.books,
          isFetchingBooks: false,
        });
      }

      return result;
    },
  };
});

export default booksStore;
