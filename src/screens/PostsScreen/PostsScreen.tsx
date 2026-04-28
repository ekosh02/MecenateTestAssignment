import {
  PostCardSkeleton,
  PostListRow,
  PostsFeedError,
  PostsListFooter,
} from "@/src/components";
import { COLORS } from "@/src/constants/colors";
import {
  POSTS_FEED_PAGE_SIZE,
  POSTS_FEED_QUERY_KEY,
  POSTS_FEED_TIER,
  fetchPosts,
  togglePostLike,
  type Post,
  type PostsResponse,
} from "@/src/lib";
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  type ListRenderItem,
  RefreshControl,
  View,
} from "react-native";
import { SKELETON_PLACEHOLDER_COUNT } from "./constants";
import { styles } from "./styles";
import { type FeedRow, isSkeletonRow } from "./types";

const PostsScreen = () => {
  const queryClient = useQueryClient();
  const [pendingLikeIds, setPendingLikeIds] = useState<Record<string, boolean>>(
    {},
  );
  const query = useInfiniteQuery({
    queryKey: [...POSTS_FEED_QUERY_KEY],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      fetchPosts({
        limit: POSTS_FEED_PAGE_SIZE,
        cursor: pageParam,
        tier: POSTS_FEED_TIER,
      }),
    getNextPageParam: (last) =>
      last.data.hasMore && last.data.nextCursor
        ? last.data.nextCursor
        : undefined,
  });

  const posts = query.data?.pages.flatMap((p) => p.data.posts) ?? [];

  const skeletonRows = useMemo<FeedRow[]>(
    () =>
      Array.from({ length: SKELETON_PLACEHOLDER_COUNT }, (_, i) => ({
        kind: "skeleton",
        id: `skeleton-${i}`,
      })),
    [],
  );

  const showFeedSkeleton =
    query.isPending ||
    (query.isRefetching && !query.isFetchingNextPage);

  const listData: FeedRow[] = showFeedSkeleton ? skeletonRows : posts;

  const setPostLikeState = useCallback(
    (postId: string, isLiked: boolean, likesCount: number) => {
      queryClient.setQueryData<InfiniteData<PostsResponse>>(
        [...POSTS_FEED_QUERY_KEY],
        (cached) => {
          if (cached === undefined) {
            return cached;
          }
          return {
            ...cached,
            pages: cached.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((post) =>
                  post.id === postId ? { ...post, isLiked, likesCount } : post,
                ),
              },
            })),
          };
        },
      );
    },
    [queryClient],
  );

  const likeMutation = useMutation({
    mutationFn: togglePostLike,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: [...POSTS_FEED_QUERY_KEY] });
      const previousFeed = queryClient.getQueryData<InfiniteData<PostsResponse>>([
        ...POSTS_FEED_QUERY_KEY,
      ]);
      const currentPost = previousFeed?.pages
        .flatMap((page) => page.data.posts)
        .find((post) => post.id === postId);
      if (currentPost === undefined) {
        return { previousFeed, postId };
      }
      const nextIsLiked = !currentPost.isLiked;
      const nextLikesCount = Math.max(
        0,
        currentPost.likesCount + (nextIsLiked ? 1 : -1),
      );
      setPostLikeState(postId, nextIsLiked, nextLikesCount);
      setPendingLikeIds((prev) => ({ ...prev, [postId]: true }));
      return { previousFeed, postId };
    },
    onError: (_error, _postId, context) => {
      if (context?.previousFeed !== undefined) {
        queryClient.setQueryData([...POSTS_FEED_QUERY_KEY], context.previousFeed);
      }
    },
    onSuccess: (result, postId) => {
      if (result.isLiked === undefined || result.likesCount === undefined) {
        return;
      }
      setPostLikeState(postId, result.isLiked, result.likesCount);
    },
    onSettled: (_result, _error, postId) => {
      setPendingLikeIds((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    },
  });

  const onLikePress = useCallback(
    (postId: string) => {
      if (pendingLikeIds[postId]) {
        return;
      }
      likeMutation.mutate(postId);
    },
    [likeMutation, pendingLikeIds],
  );

  const keyExtractor = useCallback((item: FeedRow) => item.id, []);

  const renderItem = useCallback<ListRenderItem<FeedRow>>(
    ({ item }) =>
      isSkeletonRow(item) ? (
        <PostCardSkeleton />
      ) : (
        <PostListRow
          post={item as Post}
          onLikePress={onLikePress}
          isLikePending={Boolean(pendingLikeIds[item.id])}
        />
      ),
    [onLikePress, pendingLikeIds],
  );

  const onLoadMore = useCallback(() => {
    void query.fetchNextPage();
  }, [query.fetchNextPage]);

  const onEndReached = useCallback(() => {
    if (query.isPending) {
      return;
    }
    if (query.isFetching && !query.isFetchingNextPage) {
      return;
    }
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [
    query.fetchNextPage,
    query.hasNextPage,
    query.isFetching,
    query.isFetchingNextPage,
    query.isPending,
  ]);

  const onRefresh = useCallback(() => {
    void query.refetch();
  }, [query.refetch]);

  const refreshing = query.isRefetching;

  if (query.isError) {
    return (
      <View style={styles.screen}>
        <PostsFeedError onRetry={() => void query.refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList<FeedRow>
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.PRIMARY}
            colors={[COLORS.PRIMARY]}
          />
        }
        onEndReachedThreshold={0.4}
        onEndReached={onEndReached}
        ListFooterComponent={
          showFeedSkeleton ? null : (
            <PostsListFooter
              isFetchingNextPage={query.isFetchingNextPage}
              hasNextPage={Boolean(query.hasNextPage)}
              onLoadMore={onLoadMore}
            />
          )
        }
      />
    </View>
  );
};

export default PostsScreen;
