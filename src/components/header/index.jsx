import { Book, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { useBreakpoint } from "@/js-toolkit/src/react";
import { decryptStoredUserCookie } from "@/js-toolkit/src";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AuthForm from "./auth-form";
import DetailProfile from "./detail-profile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

export default function Header() {
  const [loginInfo, setLoginInfo] = useState(() =>
    decryptStoredUserCookie(supabase),
  );

  const avatarURL = useMemo(
    () => loginInfo?.user_metadata?.avatar_url,
    [loginInfo?.user_metadata?.avatar_url],
  );

  const [showHeaderInfo, setShowHeaderInfo] = useState(false);

  const { xs } = useBreakpoint();

  const isLogin = Boolean(loginInfo);

  const handleHeaderInfoChange = (open) => {
    setShowHeaderInfo(open);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoginInfo(session?.user ?? null);
    });

    return () => {
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
              avatarURL ? (
                <img
                  alt="Foto profil pengguna"
                  className="size-10 rounded-full border-4 border-background object-cover shadow-[0_0_0_2px_rgba(77,62,44,0.16)] cursor-pointer"
                  src={avatarURL}
                  onClick={() => {
                    setShowHeaderInfo(true);
                  }}
                />
              ) : (
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
              )
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
        <Drawer open={showHeaderInfo} onOpenChange={handleHeaderInfoChange}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="sr-only">
                {isLogin ? "Detail Profile" : "Authentication"}
              </DrawerTitle>

              {isLogin ? (
                <DetailProfile
                  user={loginInfo}
                  onCloseHeaderInfo={() => {
                    setShowHeaderInfo(false);
                  }}
                />
              ) : (
                <AuthForm
                  showHeaderInfo={showHeaderInfo}
                  onSuccess={() => {
                    setShowHeaderInfo(false);
                  }}
                />
              )}
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showHeaderInfo} onOpenChange={handleHeaderInfoChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sr-only">
                {isLogin ? "Detail Profile" : "Authentication"}
              </DialogTitle>
            </DialogHeader>

            {isLogin ? (
              <DetailProfile
                user={loginInfo}
                onCloseHeaderInfo={() => {
                  setShowHeaderInfo(false);
                }}
              />
            ) : (
              <AuthForm
                showHeaderInfo={showHeaderInfo}
                onSuccess={() => {
                  setShowHeaderInfo(false);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
