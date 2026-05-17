import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { TABS } from "@/data/books";
import { Pencil } from "lucide-react";

export default function BookDetail({ book }) {
  const statusText = useMemo(() => {
    return TABS.find((tab) => tab.value === book?.status)?.label ?? "-";
  }, [book?.status]);

  if (!book) {
    return null;
  }

  return (
    <section className="w-full text-primary-text overflow-y-scroll md:overflow-y-scroll">
      <div className="grid gap-8 p-6 md:grid-cols-[330px_1fr] md:p-8">
        <img
          alt={`Sampul ${book.title}`}
          // className="mx-auto aspect-2/3 w-full max-w-82.5 rounded-xl object-cover shadow-[0_8px_20px_rgba(77,62,44,0.2)]"
          className="mx-auto aspect-2/3 w-full max-w-62 rounded-xl object-cover shadow-[0_8px_20px_rgba(77,62,44,0.2)]"
          src={book.cover}
        />

        <div className="flex min-w-0 flex-col">
          <div>
            <span className="inline-flex h-8 items-center rounded-md bg-soft-accent px-3 text-[14px] font-bold uppercase leading-none text-[#17131b]">
              {statusText}
            </span>

            <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-2">
              <div>
                <h2 className="font-heading text-[38px] font-bold leading-tight text-primary-text">
                  {book.title}
                </h2>
                <p className="mt-1 text-heading leading-tight text-secondary-text">
                  {book.author}
                </p>
              </div>

              <span className="mb-1 inline-flex h-8 items-center rounded-md bg-[#d7dde6] px-3 text-[14px] font-bold uppercase leading-none text-[#17131b]">
                Tahun: {book.year}
              </span>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-6">
            <h3 className="text-[20px] font-bold leading-tight text-[#17131b]">
              Sinopsis
            </h3>
            <p className="mt-2 text-[16px] leading-tight text-[#17131b]">
              {book.synopsis}
            </p>
          </div>

          <div className="mt-5">
            <label
              className="mb-2 block text-[18px] font-bold leading-tight text-[#17131b]"
              htmlFor={`book-note-${book.id}`}
            >
              Catatan Pribadi
            </label>
            <div className="relative">
              <textarea
                className="min-h-textarea w-full resize-none rounded-md border border-primary-accent bg-background/70 px-3 py-2 pr-20 text-[16px] leading-snug text-primary-text outline-none focus:border-hover-accent focus:ring-2 focus:ring-primary-accent/30"
                id={`book-note-${book.id}`}
                placeholder="Tambahkan catatan Anda di sini..."
              />
              <Button
                className="absolute bottom-3 right-4 text-[15px] font-medium  rounded-full p-5"
                type="button"
              >
                <Pencil />
              </Button>
            </div>
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <Button
              className="rounded-md bg-[#c95b50] font-semibold normal-case tracking-normal text-white hover:bg-[#b7493f]"
              type="button"
            >
              Delete
            </Button>
            <Button
              className="font-semibold normal-case tracking-normal "
              type="button"
              variant="outline"
            >
              Update
            </Button>
            <Button
              className="rounded-md bg-primary-accent font-semibold normal-case tracking-normal text-white hover:bg-hover-accent"
              type="button"
            >
              Update status '{statusText}'
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
