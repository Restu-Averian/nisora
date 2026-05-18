import { Book, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useBreakpoint } from "@/js-toolkit/src/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import LoginContent from "./login";
import DetailProfile from "./detail-profile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

function getStoredUser() {
  try {
    const cookies = {};
    document.cookie.split("; ").forEach((c) => {
      const eq = c.indexOf("=");
      if (eq === -1) return;
      cookies[c.slice(0, eq)] = c.slice(eq + 1);
    });

    const key = supabase.storageKey;
    if (!key) return null;

    const chunks = [];
    for (const name of Object.keys(cookies)) {
      if (name === key) chunks.push({ i: -1, v: cookies[name] });
      else if (name.startsWith(key + ".")) {
        const idx = parseInt(name.slice(key.length + 1), 10);
        if (!isNaN(idx)) chunks.push({ i: idx, v: cookies[name] });
      }
    }
    if (!chunks.length) return null;

    chunks.sort((a, b) => a.i - b.i);
    const raw = chunks.map((c) => c.v).join("");

    const PREFIX = "base64-";
    const decoded = raw.startsWith(PREFIX)
      ? atob(raw.slice(PREFIX.length).replace(/-/g, "+").replace(/_/g, "/"))
      : raw;

    return JSON.parse(decoded)?.user ?? null;
  } catch {
    return null;
  }
}

export default function Header() {
  const [loginInfo, setLoginInfo] = useState(getStoredUser);
  const [showHeaderInfo, setShowHeaderInfo] = useState(false);

  const { xs } = useBreakpoint();

  const isLogin = Boolean(loginInfo);

  console.log("log", loginInfo);

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

              {isLogin ? (
                <DetailProfile
                  user={loginInfo}
                  onLogoutSuccess={() => {
                    setShowHeaderInfo(false);
                  }}
                />
              ) : (
                <LoginContent
                  onSuccess={() => {
                    setShowHeaderInfo(false);
                  }}
                />
              )}
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
            </DialogHeader>

            {isLogin ? (
              <DetailProfile
                user={loginInfo}
                onLogoutSuccess={() => {
                  setShowHeaderInfo(false);
                }}
              />
            ) : (
              <LoginContent
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
