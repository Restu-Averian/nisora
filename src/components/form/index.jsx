import { Plus } from "lucide-react";
import { useState } from "react";
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

export default function FormBookDrawer({ setBooksRefreshKey }) {
  const [open, setOpen] = useState(false);

  const { xs } = useBreakpoint();

  return (
    <Drawer
      direction={xs ? "bottom" : "right"}
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button
          className="book-drawer__trigger md:static md:h-9 md:rounded-md md:px-4 md:py-2"
          type="button"
        >
          <Plus className="book-drawer__trigger-icon md:size-4" />
          {!xs && "Tambah Buku"}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="book-drawer__content">
        <DrawerHeader>
          <DrawerTitle className="book-drawer__title">
            Tambah Buku Baru
          </DrawerTitle>
          <DrawerDescription className="book-drawer__description">
            Form untuk menambahkan buku baru.
          </DrawerDescription>
        </DrawerHeader>

        <BookForm
          onSuccess={() => {
            setBooksRefreshKey((prev) => prev + 1);
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}
