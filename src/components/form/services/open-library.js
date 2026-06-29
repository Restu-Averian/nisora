import axios from "axios";

const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
const OPEN_LIBRARY_COVER_URL = "https://covers.openlibrary.org/b/id";

function getFirstValue(value) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function mapOpenLibraryBook(book) {
  const firstSentence = getFirstValue(book.first_sentence);
  const subject = Array.isArray(book.subject)
    ? book.subject.slice(0, 3).join(", ")
    : "";

  return {
    id: book.key ?? book.title,
    title: book.title ?? "",
    synopsis: firstSentence || subject,
    cover: book.cover_i
      ? `${OPEN_LIBRARY_COVER_URL}/${book.cover_i}-L.jpg`
      : "",
    author: Array.isArray(book.author_name) ? book.author_name.join(", ") : "",
    year: book.first_publish_year,
  };
}

export async function searchBooksFromApi(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const { data } = await axios.get(OPEN_LIBRARY_SEARCH_URL, {
    params: {
      fields:
        "key,title,author_name,first_publish_year,cover_i,first_sentence,subject",
      q: query,
    },
    timeout: 8000,
  });
  const docs = Array.isArray(data?.docs) ? data.docs : [];

  return docs
    .map(mapOpenLibraryBook)
    .filter((book) => book.title)
    .filter((book) => {
      return [book.title, book.author]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    });
}
