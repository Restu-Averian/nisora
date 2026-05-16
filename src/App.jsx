import { Tabs } from "@/components/ui/tabs";
import ListBooks from "./components/list-books";
import Header from "./components/header";
import FormBookDrawer from "./components/form";

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

            <FormBookDrawer />
          </div>

          <ListBooks />
        </Tabs>
      </section>
    </main>
  );
}

export default App;
