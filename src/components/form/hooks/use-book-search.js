import { useEffect, useRef, useState } from "react";
import { searchBooksFromApi } from "../services/open-library";

const INITIAL_BOOK_SEARCH = {
  error: "",
  hasSearched: false,
  isSearching: false,
  results: [],
  showResults: false,
};

export function useBookSearch() {
  const [bookSearch, setBookSearch] = useState(INITIAL_BOOK_SEARCH);
  const timeoutSearchRef = useRef(null);
  const searchRequestRef = useRef(0);

  function resetBookSearch() {
    searchRequestRef.current += 1;

    if (timeoutSearchRef.current) {
      window.clearTimeout(timeoutSearchRef.current);
      timeoutSearchRef.current = null;
    }

    setBookSearch(INITIAL_BOOK_SEARCH);
  }

  function handleBookSearch(query) {
    if (timeoutSearchRef.current) {
      window.clearTimeout(timeoutSearchRef.current);
    }

    if (query.trim().length < 2) {
      searchRequestRef.current += 1;
      setBookSearch({
        ...INITIAL_BOOK_SEARCH,
        showResults: Boolean(query.trim()),
      });
      return;
    }

    const requestId = searchRequestRef.current + 1;
    searchRequestRef.current = requestId;
    setBookSearch({
      ...INITIAL_BOOK_SEARCH,
      isSearching: true,
      showResults: true,
    });

    timeoutSearchRef.current = window.setTimeout(async () => {
      try {
        const books = await searchBooksFromApi(query);

        if (searchRequestRef.current !== requestId) {
          return;
        }

        setBookSearch({
          ...INITIAL_BOOK_SEARCH,
          hasSearched: true,
          results: books,
          showResults: true,
        });
      } catch {
        if (searchRequestRef.current !== requestId) {
          return;
        }

        setBookSearch({
          ...INITIAL_BOOK_SEARCH,
          error: "Gagal mencari buku. Coba ketik ulang.",
          showResults: true,
        });
      } finally {
        if (searchRequestRef.current === requestId) {
          setBookSearch((current) => ({
            ...current,
            isSearching: false,
          }));
        }
      }
    }, 350);
  }

  useEffect(() => {
    return () => {
      searchRequestRef.current += 1;

      if (timeoutSearchRef.current) {
        window.clearTimeout(timeoutSearchRef.current);
      }
    };
  }, []);

  return {
    bookSearch,
    handleBookSearch,
    resetBookSearch,
  };
}
