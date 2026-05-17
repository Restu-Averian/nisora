import { books } from "@/data/books";
import BooksTabs from "./books-tabs";
import BookGrid from "./book-grid";
import { useEffect } from "react";
import supabase from "@/lib/supabase";

export default function ListBooks() {
  useEffect(() => {
    supabase
      .from("users")
      ?.select()
      ?.then((value) => {
        console.log("data users", value);
      });
  }, []);
  return (
    <>
      <BooksTabs />
      <BookGrid books={books} />
    </>
  );
}
