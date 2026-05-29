import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

export default function FormBookDrawer({ onBookAdded }) {
  const [open, setOpen] = useState(false);
  const shouldRefreshAfterCloseRef = useRef(false);

  const { xs } = useBreakpoint();

  function handleBookAdded() {
    shouldRefreshAfterCloseRef.current = true;
    setOpen(false);
  }

  useEffect(() => {
    if (open || !shouldRefreshAfterCloseRef.current) {
      return;
    }

    onBookAdded?.();
    shouldRefreshAfterCloseRef.current = false;
  }, [onBookAdded, open]);

  return (
    <Drawer
      direction={xs ? "bottom" : "right"}
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button
          className="h-auto md:h-9 fixed bottom-5 right-5 md:static rounded-full md:rounded-md bg-primary-accent px-5 py-5 md:py-2 md:px-4 text-xs font-semibold normal-case tracking-normal text-white shadow-inset-button hover:bg-hover-accent "
          type="button"
        >
          <Plus className="size-6 md:size-4" />
          {!xs && "Tambah Buku"}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="px-10">
        <DrawerHeader>
          <DrawerTitle className="text-center">Tambah Buku Baru</DrawerTitle>
          <DrawerDescription className="text-center">
            Form untuk menambahkan buku baru.
          </DrawerDescription>
        </DrawerHeader>

        <BookForm onSuccess={handleBookAdded} />
      </DrawerContent>
    </Drawer>
  );
}
