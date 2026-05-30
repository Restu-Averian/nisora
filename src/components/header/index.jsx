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
      <header className="site-header">
        <div className="site-header__inner lg:px-10">
          <div className="site-header__brand-wrap">
            <div className="site-header__brand">
              <Book />
              <p className="site-header__brand-text">Nisora</p>
            </div>
          </div>

          <nav aria-label="Navigasi halaman" className="site-header__nav">
            {isLogin ? (
              avatarURL ? (
                <img
                  alt="Foto profil pengguna"
                  className="site-header__avatar"
                  src={avatarURL}
                  onClick={() => {
                    setShowHeaderInfo(true);
                  }}
                />
              ) : (
                <Button
                  aria-label="Profil"
                  className="site-header__profile-button"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setShowHeaderInfo(true);
                  }}
                >
                  <UserCircle className="site-header__profile-icon" />
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
