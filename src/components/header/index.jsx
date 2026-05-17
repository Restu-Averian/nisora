import { Book, ChevronLeft, Menu, Search, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { useEffect } from "react";

export default function Header() {
  const handleSignInWithEmail = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: "restuaverianputra123@gmail.com",
      options: {
        emailRedirectTo: "http://localhost:5173",
      },
    });

    console.log("data sign in otp", data, error);
    console.log("error sign in otp", data, error);
  };

  const getUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("user", user);
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <header className="border-b border-border bg-background/90">
      <div className="mx-auto flex h-header max-w-content items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Book />
            <p className="font-heading text-3xl font-semibold italic leading-none">
              Nisora
            </p>
          </div>
        </div>

        <nav aria-label="Navigasi halaman" className="flex items-center gap-3">
          <Button
            aria-label="Kembali"
            className="size-8 rounded-full border-0 bg-transparent p-0 text-muted-foreground shadow-none hover:bg-surface"
            size="icon"
            variant="ghost"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            aria-label="Menu"
            className="size-8 rounded-full border-0 bg-transparent p-0 text-muted-foreground shadow-none hover:bg-surface"
            size="icon"
            variant="ghost"
          >
            <Menu className="size-5" />
          </Button>
          <Button
            aria-label="Profil"
            className="size-8 rounded-full border-0 bg-transparent p-0 text-primary-text shadow-none hover:bg-surface"
            size="icon"
            variant="ghost"
          >
            <UserCircle className="size-7 fill-primary-text/20" />
          </Button>
        </nav>
      </div>

      <Button
        onClick={() => {
          handleSignInWithEmail();
        }}
      >
        Login with Google
      </Button>
    </header>
  );
}
