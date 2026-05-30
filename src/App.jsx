import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import ListBooks from "./components/list-books";
import Header from "./components/header";
import FormBookDrawer from "./components/form";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [booksRefreshKey, setBooksRefreshKey] = useState(0);

  return (
    <main className="app-shell">
      <Header />

      <section className="app-content lg:px-10">
        <Tabs defaultValue="all">
          <div className="app-toolbar">
            <h1 className="app-title">Koleksi Buku</h1>

            <FormBookDrawer setBooksRefreshKey={setBooksRefreshKey} />
          </div>

          <ListBooks refreshKey={booksRefreshKey} />
        </Tabs>
      </section>

      <Toaster />
    </main>
  );
}

export default App;
