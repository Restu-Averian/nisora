import { Book, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoginContent from "./login";
import DetailProfile from "./detail-profile";
import { useBreakpoint } from "@/js-toolkit/src/react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

export default function Header() {
  const [loginInfo, setLoginInfo] = useState(null);
  const [showHeaderInfo, setShowHeaderInfo] = useState(false);

  const { xs } = useBreakpoint();

  const isLogin = Boolean(loginInfo);

  useEffect(() => {
    let shouldSync = true;

    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!shouldSync) {
        return;
      }

      if (error) {
        console.error("get user error", error);
      }

      console.log("us", user);

      setLoginInfo(user ?? null);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoginInfo(session?.user ?? null);
    });

    return () => {
      shouldSync = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
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

          <nav
            aria-label="Navigasi halaman"
            className="flex items-center gap-3"
          >
            {isLogin ? (
              <Button
                aria-label="Profil"
                className="size-8 rounded-full border-0 bg-transparent p-0 text-primary-text shadow-none hover:bg-surface"
                size="icon"
                variant="ghost"
                onClick={() => {
                  setShowHeaderInfo(true);
                }}
              >
                <UserCircle className="size-7 fill-primary-text/20" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setShowHeaderInfo(true);
                }}
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      </header>

      {xs ? (
        <Drawer open={showHeaderInfo} onOpenChange={setShowHeaderInfo}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="sr-only">
                {isLogin ? "Detail Profile" : "Login"}
              </DrawerTitle>
              <DrawerDescription>
                {isLogin ? (
                  <DetailProfile user={loginInfo} />
                ) : (
                  <LoginContent />
                )}
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showHeaderInfo} onOpenChange={setShowHeaderInfo}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sr-only">
                {isLogin ? "Detail Profile" : "Login"}
              </DialogTitle>
              <DialogDescription>
                {isLogin ? (
                  <DetailProfile user={loginInfo} />
                ) : (
                  <LoginContent />
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
