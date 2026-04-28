import type { Post } from "@/src/lib";
import type { ImageRef } from "expo-image";

export interface PostCardProps {
  post: Post;
  coverAspectRatio: number;
  coverImageRef?: ImageRef;
  onDonatePress?: () => void;
  onLikePress?: () => void;
  isLikePending?: boolean;
}

export interface PostListRowProps {
  post: Post;
  onLikePress?: (postId: string) => void;
  isLikePending?: boolean;
}
