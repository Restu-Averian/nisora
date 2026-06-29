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
    personal_note: book.personal_note ?? "",
  };
}

async function loadBooksByUserId(userId) {
  const { data, error } = await supabase
    .from("books")
    .select(
      "id,title,authors,synopsis,published_year,cover_url,status,personal_note,created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return {
    books: (data ?? []).map((book) => mapBookFromSupabase(book)),
    error,
  };
}

async function getActiveSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return { session: null, error };
  }

  if (!session) {
    return {
      session: null,
      error: new Error("Sesi berakhir. Silakan login ulang."),
    };
  }

  return { session, error: null };
}

const booksStore = create((set) => {
  return {
    books: [],
    isFetchingBooks: true,
    searchValue: "",
    isFormDrawerOpen: false,

    setSearchValue(searchValue) {
      set({ searchValue });
    },

    setFormDrawerOpen(isOpen) {
      set({ isFormDrawerOpen: isOpen });
    },

    clearBooks() {
      set({
        books: [],
        isFetchingBooks: false,
        searchValue: "",
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

    async updateBookStatus({ bookId, newStatusValue }) {
      const { session, error: sessionError } = await getActiveSession();

      if (sessionError) {
        return { error: sessionError };
      }

      const { error } = await supabase
        .from("books")
        .update({ status: newStatusValue })
        .eq("id", bookId)
        .eq("user_id", session?.user.id);

      if (error) {
        return { error };
      }

      set((state) => {
        return {
          books: state?.books.map((book) => {
            if (book.id !== bookId) {
              return book;
            }

            return {
              ...book,
              status: newStatusValue,
            };
          }),
        };
      });

      return { error: null };
    },

    async updateBook({ bookId, payload }) {
      const { session, error: sessionError } = await getActiveSession();

      if (sessionError) {
        return { book: null, error: sessionError };
      }

      const { data, error } = await supabase
        .from("books")
        .update(payload)
        .eq("id", bookId)
        .eq("user_id", session?.user.id)
        .select(
          "id,title,authors,synopsis,published_year,cover_url,status,personal_note,created_at",
        )
        .single();

      if (error) {
        return { book: null, error };
      }

      const updatedBook = mapBookFromSupabase(data);

      set((state) => {
        return {
          books: state?.books.map((book) => {
            if (book.id !== bookId) {
              return book;
            }

            return updatedBook;
          }),
        };
      });

      return { book: updatedBook, error: null };
    },

    async deleteBook({ bookId }) {
      const { session, error: sessionError } = await getActiveSession();

      if (sessionError) {
        return { error: sessionError };
      }

      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", bookId)
        .eq("user_id", session?.user.id);

      if (error) {
        return { error };
      }

      set((state) => {
        return {
          books: state?.books.filter((book) => book.id !== bookId),
        };
      });

      return { error: null };
    },
  };
});

export default booksStore;
