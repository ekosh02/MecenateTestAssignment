import { API_BASE_URL } from "@/src/constants/api";
import {
  incrementPostCommentsCountInFeed,
  prependCommentIfMissing,
  type PostComment,
  type PostCommentsResponse,
  updatePostLikesCountInFeed,
} from "@/src/lib";
import { authStore } from "@/src/store";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface RealtimeCommentAddedEvent {
  type: "comment_added";
  postId: string;
  comment: PostComment;
}

interface RealtimeLikeUpdatedEvent {
  type: "like_updated";
  postId: string;
  likesCount: number;
}

interface UsePostRealtimeParams {
  postId: string | undefined;
  queryClient: QueryClient;
}

export function usePostRealtime({ postId, queryClient }: UsePostRealtimeParams) {
  useEffect(() => {
    if (postId === undefined || authStore.token.trim().length === 0) {
      return;
    }

    const wsBase = API_BASE_URL.replace(/^http/i, "ws").replace(/\/$/, "");
    const ws = new WebSocket(
      `${wsBase}/ws?token=${encodeURIComponent(authStore.token.trim())}`,
    );

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data as string) as
          | RealtimeCommentAddedEvent
          | RealtimeLikeUpdatedEvent
          | { type?: string };

        if (payload.type === "comment_added") {
          const data = payload as RealtimeCommentAddedEvent;
          if (data.postId !== postId) {
            return;
          }

          queryClient.setQueryData<InfiniteData<PostCommentsResponse>>(
            ["posts", "comments", data.postId],
            (cached) => prependCommentIfMissing(cached, data.comment),
          );
          incrementPostCommentsCountInFeed(queryClient, data.postId);
        }

        if (payload.type === "like_updated") {
          const data = payload as RealtimeLikeUpdatedEvent;
          updatePostLikesCountInFeed(queryClient, data.postId, data.likesCount);
        }
      } catch {
        return;
      }
    };

    return () => {
      ws.close();
    };
  }, [postId, queryClient]);
}
