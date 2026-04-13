import { usePostCoverImage } from "@/hooks/use-post-cover-image";
import PostCard from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";
import { COVER_IMAGE_FALLBACK_ASPECT_RATIO } from "./constants";
import type { PostListRowProps } from "./types";

const PostListRow = ({ post }: PostListRowProps) => {
  const cover = usePostCoverImage(post.coverUrl);

  if (cover.status === "loading") {
    return <PostCardSkeleton />;
  }

  if (cover.status === "error") {
    return (
      <PostCard
        post={post}
        coverAspectRatio={COVER_IMAGE_FALLBACK_ASPECT_RATIO}
      />
    );
  }

  return (
    <PostCard
      post={post}
      coverAspectRatio={cover.aspectRatio}
      coverImageRef={cover.coverImage}
    />
  );
};

export default PostListRow;
