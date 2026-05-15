import { AddBookDrawer } from "@/components/AddBookDrawer";
import { BookGrid } from "@/components/BookGrid";
import { BookTabs } from "@/components/BookTabs";
import { Header } from "@/components/Header";
import { Tabs } from "@/components/ui/tabs";
import { books } from "@/data/books";

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-primary-text">
      <Header />

      <section className="mx-auto w-full max-w-content px-6 pb-12 pt-7 lg:px-10">
        <Tabs defaultValue="all">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-heading text-display font-bold leading-none tracking-normal">
              Koleksi Buku
            </h1>

            <AddBookDrawer />
          </div>

          <BookTabs />
          <BookGrid books={books} />
        </Tabs>
      </section>
    </main>
  );
}

export default App;
