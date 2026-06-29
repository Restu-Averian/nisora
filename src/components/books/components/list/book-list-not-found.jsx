import { Button } from "@/components/ui/button";
import useBooksStore from "@/store/booksStore";
import illustNotFound from "../../../../assets/illust_not_found.png";

export default function BookListNotFound() {
  const setFormDrawerOpen = useBooksStore((state) => state.setFormDrawerOpen);

  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-107.5 max-w-6xl items-center justify-center rounded-2xl border border-[#ddd6cc] bg-[#fffaf4]/90 px-6 py-10 shadow-[0_12px_35px_rgba(70,55,35,0.12)] sm:px-10 lg:px-16">
        <div className="grid w-full items-center gap-10 md:grid-cols-[1fr_0.9fr] lg:gap-16">
          {/* Illustration */}
          <div className="flex justify-center md:justify-end">
            <div className="relative flex w-full max-w-107.5 items-center justify-center">
              <div className="absolute inset-4 rounded-full bg-[#f4eee4]/80 blur-sm" />

              <img
                alt="Ilustrasi koleksi kosong"
                className="relative z-10 h-auto w-full max-w-80 object-contain"
                src={illustNotFound}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3">
            <h2 className="max-w-110 font-serif text-3xl font-bold leading-tight tracking-[-0.03em] text-[#4c4b58] sm:text-4xl">
              Belum ada buku
              <br />
              di koleksimu
            </h2>

            <p className="max-w-107.5 text-md leading-relaxed text-[#747382] sm:text-lg">
              Tambahkan buku pertamamu untuk memulai perjalanan membaca.
            </p>

            <Button type="button" onClick={() => setFormDrawerOpen(true)}>
              <span className="mr-3 text-2xl font-light leading-none">+</span>
              Tambah Buku
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
