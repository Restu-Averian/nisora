import { z } from "zod";

export const BOOK_FORM_DEFAULT_VALUES = {
  title: "",
  synopsis: "",
  cover: undefined,
  author: "",
  year: 1,
};

export const formSchema = z.object({
  title: z.string().min(1, "Wajib diisi"),
  synopsis: z.string().optional(),
  cover: z.union([z.instanceof(File), z.string().url()]).optional(),
  author: z.string().optional(),
  year: z.number().int().positive().optional(),
});
