import {
  COVER_IMAGE_FALLBACK_ASPECT_RATIO,
} from "@/components/post-card/constants";
import type { ImageRef } from "expo-image";
import { useImage } from "expo-image";
import { useEffect, useState } from "react";

export type PostCoverImageState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; coverImage: ImageRef; aspectRatio: number };

export function usePostCoverImage(coverUrl: string): PostCoverImageState {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [coverUrl]);

  const coverImage = useImage(
    coverUrl,
    {
      onError() {
        setFailed(true);
      },
    },
    [coverUrl],
  );

  if (failed) {
    return { status: "error" };
  }

  if (!coverImage) {
    return { status: "loading" };
  }

  const width = coverImage.width;
  const height = coverImage.height;
  const ratio = height > 0 ? width / height : COVER_IMAGE_FALLBACK_ASPECT_RATIO;
  const aspectRatio =
    Number.isFinite(ratio) && ratio > 0
      ? ratio
      : COVER_IMAGE_FALLBACK_ASPECT_RATIO;

  return { status: "ready", coverImage, aspectRatio };
}
