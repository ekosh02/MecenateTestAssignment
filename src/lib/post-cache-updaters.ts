import type {
  InfiniteData,
  QueryClient,
  Updater,
} from "@tanstack/react-query";
import { POSTS_FEED_QUERY_KEY } from "./posts-api";
import type { PostComment, PostCommentsResponse, PostsResponse } from "./posts-api";

function updateFeed(
  queryClient: QueryClient,
  updater: Updater<
    InfiniteData<PostsResponse> | undefined,
    InfiniteData<PostsResponse> | undefined
  >,
) {
  queryClient.setQueryData<InfiniteData<PostsResponse>>(
    [...POSTS_FEED_QUERY_KEY],
    updater,
  );
}

export function updatePostLikeInFeed(
  queryClient: QueryClient,
  postId: string,
  isLiked: boolean,
  likesCount: number,
) {
  updateFeed(queryClient, (cached) => {
    if (cached === undefined) {
      return cached;
    }
    return {
      ...cached,
      pages: cached.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          posts: page.data.posts.map((item) =>
            item.id === postId ? { ...item, isLiked, likesCount } : item,
          ),
        },
      })),
    };
  });
}

export function updatePostLikesCountInFeed(
  queryClient: QueryClient,
  postId: string,
  likesCount: number,
) {
  updateFeed(queryClient, (cached) => {
    if (cached === undefined) {
      return cached;
    }
    return {
      ...cached,
      pages: cached.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          posts: page.data.posts.map((item) =>
            item.id === postId ? { ...item, likesCount } : item,
          ),
        },
      })),
    };
  });
}

export function incrementPostCommentsCountInFeed(
  queryClient: QueryClient,
  postId: string,
) {
  updateFeed(queryClient, (cached) => {
    if (cached === undefined) {
      return cached;
    }
    return {
      ...cached,
      pages: cached.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          posts: page.data.posts.map((item) =>
            item.id === postId
              ? { ...item, commentsCount: item.commentsCount + 1 }
              : item,
          ),
        },
      })),
    };
  });
}

export function prependCommentIfMissing(
  cached: InfiniteData<PostCommentsResponse> | undefined,
  comment: PostComment,
): InfiniteData<PostCommentsResponse> {
  if (cached === undefined) {
    return {
      pages: [
        {
          ok: true,
          data: {
            comments: [comment],
            nextCursor: null,
            hasMore: false,
          },
        },
      ],
      pageParams: [undefined],
    };
  }

  const exists = cached.pages.some((page) =>
    page.data.comments.some((item) => item.id === comment.id),
  );
  if (exists) {
    return cached;
  }

  const [firstPage, ...restPages] = cached.pages;
  return {
    ...cached,
    pages: [
      {
        ...firstPage,
        data: {
          ...firstPage.data,
          comments: [comment, ...firstPage.data.comments],
        },
      },
      ...restPages,
    ],
  };
}

export function replaceCommentInFirstPage(
  cached: InfiniteData<PostCommentsResponse> | undefined,
  targetId: string,
  replacement: PostComment,
): InfiniteData<PostCommentsResponse> | undefined {
  if (cached === undefined) {
    return cached;
  }
  const [firstPage, ...restPages] = cached.pages;
  return {
    ...cached,
    pages: [
      {
        ...firstPage,
        data: {
          ...firstPage.data,
          comments: firstPage.data.comments
            .map((comment) => (comment.id === targetId ? replacement : comment))
            .filter(
              (comment, index, arr) =>
                arr.findIndex((item) => item.id === comment.id) === index,
            ),
        },
      },
      ...restPages,
    ],
  };
}

export function removeCommentFromFirstPage(
  cached: InfiniteData<PostCommentsResponse> | undefined,
  commentId: string,
): InfiniteData<PostCommentsResponse> | undefined {
  if (cached === undefined) {
    return cached;
  }
  const [firstPage, ...restPages] = cached.pages;
  return {
    ...cached,
    pages: [
      {
        ...firstPage,
        data: {
          ...firstPage.data,
          comments: firstPage.data.comments.filter(
            (comment) => comment.id !== commentId,
          ),
        },
      },
      ...restPages,
    ],
  };
}
