import { usePostCoverImage } from "@/src/hooks/use-post-cover-image";
import { router } from "expo-router";
import { Pressable } from "react-native";
import PostCard from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";
import { COVER_IMAGE_FALLBACK_ASPECT_RATIO } from "./constants";
import type { PostListRowProps } from "./types";

const PostListRow = ({
  post,
  onLikePress,
  onCommentPress,
  isLikePending,
}: PostListRowProps) => {
  const cover = usePostCoverImage(post.coverUrl);

  if (cover.status === "loading") {
    return <PostCardSkeleton />;
  }

  const card =
    cover.status === "error" ? (
      <PostCard
        post={post}
        coverAspectRatio={COVER_IMAGE_FALLBACK_ASPECT_RATIO}
        onLikePress={
          onLikePress === undefined ? undefined : () => onLikePress(post.id)
        }
        onCommentPress={
          onCommentPress === undefined ? undefined : () => onCommentPress(post.id)
        }
        isLikePending={isLikePending}
      />
    ) : (
      <PostCard
        post={post}
        coverAspectRatio={cover.aspectRatio}
        coverImageRef={cover.coverImage}
        onLikePress={
          onLikePress === undefined ? undefined : () => onLikePress(post.id)
        }
        onCommentPress={
          onCommentPress === undefined ? undefined : () => onCommentPress(post.id)
        }
        isLikePending={isLikePending}
      />
    );

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: "/(private)/post-detail",
          params: { id: post.id },
        })
      }
    >
      {card}
    </Pressable>
  );
};

export default PostListRow;
