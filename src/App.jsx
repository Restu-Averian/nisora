import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import ListBooks from "./components/books";
import Header from "./components/header";
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
          </div>

          <ListBooks
            refreshKey={booksRefreshKey}
            setBooksRefreshKey={setBooksRefreshKey}
          />
        </Tabs>
      </section>

      <Toaster />
    </main>
  );
}

export default App;
