import type { Post } from "@/lib/posts-api";
import type { ImageRef } from "expo-image";

export interface PostCardProps {
  post: Post;
  coverAspectRatio: number;
  coverImageRef?: ImageRef;
  onDonatePress?: () => void;
}

export interface PostListRowProps {
  post: Post;
}
