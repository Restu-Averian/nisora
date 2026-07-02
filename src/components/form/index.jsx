import { Plus, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import BookForm from "./book-form";
import { useBreakpoint } from "@/js-toolkit/src/react";
import useBooksStore from "@/store/booksStore";
import { useShallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import { decryptStoredUserCookie } from "@/js-toolkit/src";
import supabase from "@/lib/supabase";
import botanicalImg from "@/assets/delicate_botanical_watercolor_branch.webp";

const drawerTriggerClassName =
  "fixed bottom-5 right-5 z-40 h-auto rounded-full bg-primary-accent px-5 py-5 text-xs font-semibold normal-case tracking-normal text-white shadow-inset-button hover:bg-hover-accent md:static md:z-auto md:h-12 md:min-w-36 md:rounded-lg md:px-6 md:py-3 md:text-base";
const drawerTriggerIconClassName = "size-6 md:size-4";
const drawerContentClassName = "bg-[#FCF9F3] border-none p-0 overflow-hidden flex flex-col !rounded-t-3xl sm:!rounded-t-none sm:!rounded-l-3xl";

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
        <DrawerHeader className="relative flex flex-row items-center gap-4 px-6 pt-8 pb-6 sm:px-8 border-b border-[#E8DFD1] text-left md:text-left z-10 bg-transparent sm:pt-10">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#F3EAD8] z-10">
            <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-[#2C364C]" strokeWidth={1.5} />
          </div>
          
          <div className="flex flex-col gap-1 z-10">
            <DrawerTitle className="font-heading text-xl sm:text-[28px] font-semibold tracking-normal normal-case text-[#2C364C]">
              Tambah Buku Baru
            </DrawerTitle>
            <DrawerDescription className="text-xs sm:text-sm text-muted-foreground mt-0">
              Form untuk menambahkan buku baru.
            </DrawerDescription>
          </div>

          <img
            src={botanicalImg}
            alt=""
            className="absolute top-0 right-0 w-32 sm:w-48 h-auto opacity-90 pointer-events-none mix-blend-multiply object-cover object-left-bottom"
          />

          <DrawerClose className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 hover:bg-white/90 backdrop-blur-sm transition-colors border border-black/5">
            <X className="h-4 w-4 text-[#2C364C]" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 relative z-10 flex flex-col min-h-0">
          <BookForm
            onSuccessCallback={() => {
              setBooksRefreshKey((prev) => prev + 1);
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
