import { useEffect, useMemo } from "react";

export function useCoverPreview(coverFile) {
  const coverPreview = useMemo(() => {
    if (!coverFile) {
      return "";
    }

    if (typeof coverFile === "string") {
      return coverFile;
    }

    return URL.createObjectURL(coverFile);
  }, [coverFile]);

  useEffect(() => {
    if (!coverPreview || typeof coverFile === "string") {
      return;
    }

    return () => {
      URL.revokeObjectURL(coverPreview);
    };
  }, [coverFile, coverPreview]);

  return coverPreview;
}
