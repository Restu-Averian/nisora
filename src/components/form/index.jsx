import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import BookForm from "./book-form";
import { useBreakpoint } from "@/js-toolkit/src/react";
import useBooksStore from "@/store/booksStore";
import { useShallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import { decryptStoredUserCookie } from "@/js-toolkit/src";
import supabase from "@/lib/supabase";

const drawerTriggerClassName =
  "fixed bottom-5 right-5 h-auto rounded-full bg-primary-accent px-5 py-5 text-xs font-semibold normal-case tracking-normal text-white shadow-inset-button hover:bg-hover-accent md:static md:h-9 md:rounded-md md:px-4 md:py-2";
const drawerTriggerIconClassName = "size-6 md:size-4";
const drawerContentClassName = "px-10";
const drawerHeaderTextClassName = "text-center";

export default function FormBookDrawer({ setBooksRefreshKey }) {
  const [loginInfo, setLoginInfo] = useState(() =>
    decryptStoredUserCookie(supabase),
  );

  const { isFormDrawerOpen, setFormDrawerOpen } = useBooksStore(
    useShallow((state) => {
      return {
        isFormDrawerOpen: state.isFormDrawerOpen,
        setFormDrawerOpen: state.setFormDrawerOpen,
      };
    }),
  );

  const { xs } = useBreakpoint();

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

  if (!loginInfo) return null;

  return (
    <Drawer
      direction={xs ? "bottom" : "right"}
      open={isFormDrawerOpen}
      onOpenChange={setFormDrawerOpen}
    >
      <DrawerTrigger asChild>
        <Button
          className={drawerTriggerClassName}
          type="button"
        >
          <Plus className={drawerTriggerIconClassName} />
          {!xs && "Tambah Buku"}
        </Button>
      </DrawerTrigger>

      <DrawerContent className={drawerContentClassName}>
        <DrawerHeader>
          <DrawerTitle className={drawerHeaderTextClassName}>
            Tambah Buku Baru
          </DrawerTitle>
          <DrawerDescription className={drawerHeaderTextClassName}>
            Form untuk menambahkan buku baru.
          </DrawerDescription>
        </DrawerHeader>

        <BookForm
          onSuccessCallback={() => {
            setBooksRefreshKey((prev) => prev + 1);
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}
