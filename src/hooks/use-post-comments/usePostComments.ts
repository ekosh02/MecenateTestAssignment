import {
  addPostComment,
  fetchPostComments,
  type PostComment,
  type PostCommentsResponse,
  prependCommentIfMissing,
  removeCommentFromFirstPage,
  replaceCommentInFirstPage,
} from "@/src/lib";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const COMMENTS_PAGE_SIZE = 20;
const COMMENT_MAX_LENGTH = 500;

export const COMMENTS_SKELETON_COUNT = 4;

interface UsePostCommentsParams {
  postId: string | undefined;
  queryClient: QueryClient;
}

export function usePostComments({ postId, queryClient }: UsePostCommentsParams) {
  const [commentText, setCommentText] = useState("");

  const commentsQuery = useInfiniteQuery({
    queryKey: ["posts", "comments", postId],
    initialPageParam: undefined as string | undefined,
    enabled: postId !== undefined,
    queryFn: ({ pageParam }) =>
      fetchPostComments({
        postId: postId as string,
        limit: COMMENTS_PAGE_SIZE,
        cursor: pageParam,
      }),
    getNextPageParam: (last) =>
      last.data.hasMore && last.data.nextCursor
        ? last.data.nextCursor
        : undefined,
  });

  const comments = useMemo(
    () => commentsQuery.data?.pages.flatMap((page) => page.data.comments) ?? [],
    [commentsQuery.data?.pages],
  );

  const addCommentMutation = useMutation({
    mutationFn: addPostComment,
    onMutate: async ({ postId: targetPostId, text }) => {
      const trimmed = text.trim();
      if (trimmed.length === 0) {
        return {};
      }

      await queryClient.cancelQueries({
        queryKey: ["posts", "comments", targetPostId],
      });

      const optimisticComment: PostComment = {
        id: `optimistic-${Date.now()}`,
        postId: targetPostId,
        text: trimmed,
        createdAt: new Date().toISOString(),
        author: {
          id: "me",
          displayName: "Вы",
        },
      };

      queryClient.setQueryData<InfiniteData<PostCommentsResponse>>(
        ["posts", "comments", targetPostId],
        (cached) => prependCommentIfMissing(cached, optimisticComment),
      );

      return {
        optimisticId: optimisticComment.id,
      };
    },
    onSuccess: (result, variables, context) => {
      setCommentText("");
      if (result.comment === undefined || context?.optimisticId === undefined) {
        return;
      }

      queryClient.setQueryData<InfiniteData<PostCommentsResponse>>(
        ["posts", "comments", variables.postId],
        (cached) =>
          replaceCommentInFirstPage(cached, context.optimisticId, result.comment!),
      );
    },
    onError: (_error, variables, context) => {
      if (context?.optimisticId === undefined) {
        return;
      }
      queryClient.setQueryData<InfiniteData<PostCommentsResponse>>(
        ["posts", "comments", variables.postId],
        (cached) => removeCommentFromFirstPage(cached, context.optimisticId!),
      );
    },
    onSettled: (_result, _error, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["posts", "comments", variables.postId],
      });
    },
  });

  const onCommentSubmit = useCallback(() => {
    const trimmed = commentText.trim();
    if (postId === undefined || trimmed.length === 0) {
      return;
    }
    addCommentMutation.mutate({
      postId,
      text: trimmed.slice(0, COMMENT_MAX_LENGTH),
    });
  }, [addCommentMutation, commentText, postId]);

  const onCommentsScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!commentsQuery.hasNextPage || commentsQuery.isFetchingNextPage) {
        return;
      }
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      const distanceToBottom =
        contentSize.height - (contentOffset.y + layoutMeasurement.height);
      if (distanceToBottom < 280) {
        void commentsQuery.fetchNextPage();
      }
    },
    [commentsQuery],
  );

  const canSubmitComment =
    commentText.trim().length > 0 &&
    commentText.trim().length <= COMMENT_MAX_LENGTH &&
    !addCommentMutation.isPending;

  const commentsTitle =
    comments.length === 1 ? "1 комментарий" : `${comments.length} комментария`;

  return {
    commentsQuery,
    comments,
    commentsTitle,
    commentText,
    setCommentText,
    onCommentSubmit,
    canSubmitComment,
    onCommentsScroll,
    isCommentSubmitPending: addCommentMutation.isPending,
    maxCommentLength: COMMENT_MAX_LENGTH,
  };
}
