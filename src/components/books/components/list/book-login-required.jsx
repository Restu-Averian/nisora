import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BookLoginRequired() {
  const openLogin = () => {
    window.dispatchEvent(new CustomEvent("nisora:open-auth"));
  };

  return (
    <section className="flex w-full justify-center px-4 py-12 sm:px-6 lg:px-10">
      <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <div className="rounded-full border border-[#ddd6cc] bg-[#fffaf4] p-4 text-[#8a6f42]">
          <LogIn aria-hidden="true" className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#4c4b58]">
            Login untuk melihat koleksimu
          </h2>
          <p className="text-md leading-relaxed text-[#747382] sm:text-lg">
            Masuk dulu agar daftar buku, status bacaan, dan catatan pribadimu
            bisa dimuat.
          </p>
        </div>

        <Button type="button" onClick={openLogin}>
          <LogIn aria-hidden="true" className="mr-2 size-4" />
          Login
        </Button>
      </div>
    </section>
  );
}
