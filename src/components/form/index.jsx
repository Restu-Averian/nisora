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

export default function FormBookDrawer() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          className="h-9 rounded-md bg-primary-accent px-4 text-xs font-semibold normal-case tracking-normal text-white shadow-inset-button hover:bg-hover-accent"
          type="button"
        >
          <Plus className="size-4" />
          Tambah Buku
        </Button>
      </DrawerTrigger>

      <DrawerContent className="px-10">
        <DrawerHeader>
          <DrawerTitle className="text-center">Tambah Buku Baru</DrawerTitle>
          <DrawerDescription className="text-center">
            Form untuk menambahkan buku baru.
          </DrawerDescription>
        </DrawerHeader>

        <BookForm />
      </DrawerContent>
    </Drawer>
  );
}
