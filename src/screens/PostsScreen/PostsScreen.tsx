import {
  PostCardSkeleton,
  PostListRow,
  PostsFeedError,
  PostsListFooter,
} from "@/src/components";
import { COLORS } from "@/src/constants/colors";
import {
  POSTS_FEED_PAGE_SIZE,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  type ListRenderItem,
  Pressable,
  RefreshControl,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { router } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SKELETON_PLACEHOLDER_COUNT } from "./constants";
import { styles } from "./styles";
import { type FeedRow, isSkeletonRow } from "./types";

type FeedTier = "all" | "free" | "paid";

interface TierFilterItem {
  id: FeedTier;
  label: string;
}

const TIER_FILTERS: TierFilterItem[] = [
  { id: "all", label: "Все" },
  { id: "free", label: "Бесплатные" },
  { id: "paid", label: "Платные" },
];

const PostsScreen = () => {
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] = useState<FeedTier>("all");
  const [pendingLikeIds, setPendingLikeIds] = useState<Record<string, boolean>>(
    {},
  );
  const [filterWidth, setFilterWidth] = useState(0);
  const activeIndex = useMemo(
    () => TIER_FILTERS.findIndex((item) => item.id === selectedTier),
    [selectedTier],
  );
  const tabCount = TIER_FILTERS.length;
  const tabWidth = tabCount > 0 ? filterWidth / tabCount : 0;

  const indicatorX = useSharedValue(0);
  const contentOpacity = useSharedValue(1);
  const contentTranslateY = useSharedValue(0);

  useEffect(() => {
    if (tabWidth <= 0 || activeIndex < 0) {
      return;
    }
    indicatorX.value = withTiming(activeIndex * tabWidth, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
    contentOpacity.value = 0;
    contentTranslateY.value = 8;
    contentOpacity.value = withTiming(1, {
      duration: 220,
      easing: Easing.out(Easing.quad),
    });
    contentTranslateY.value = withTiming(0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeIndex, contentOpacity, contentTranslateY, indicatorX, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const queryKey = useMemo(
    () => [
      "posts",
      "feed",
      {
        limit: POSTS_FEED_PAGE_SIZE,
        tier: selectedTier,
      },
    ],
    [selectedTier],
  );

  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      fetchPosts({
        limit: POSTS_FEED_PAGE_SIZE,
        cursor: pageParam,
        tier: selectedTier === "all" ? undefined : selectedTier,
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
        id: `skeleton-${selectedTier}-${i}`,
      })),
    [selectedTier],
  );

  const showFeedSkeleton =
    query.isPending ||
    (query.isRefetching && !query.isFetchingNextPage);

  const listData: FeedRow[] = showFeedSkeleton ? skeletonRows : posts;

  const setPostLikeState = useCallback(
    (postId: string, isLiked: boolean, likesCount: number) => {
      queryClient.setQueryData<InfiniteData<PostsResponse>>(queryKey, (cached) => {
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
      });
    },
    [queryClient, queryKey],
  );

  const likeMutation = useMutation({
    mutationFn: togglePostLike,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousFeed = queryClient.getQueryData<InfiniteData<PostsResponse>>(queryKey);
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
        queryClient.setQueryData(queryKey, context.previousFeed);
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

  const onCommentPress = useCallback((postId: string) => {
    router.push({
      pathname: "/(private)/post-detail",
      params: { id: postId, focusComments: "1" },
    });
  }, []);

  const renderItem = useCallback<ListRenderItem<FeedRow>>(
    ({ item }) =>
      isSkeletonRow(item) ? (
        <PostCardSkeleton />
      ) : (
        <PostListRow
          post={item as Post}
          onLikePress={onLikePress}
          onCommentPress={onCommentPress}
          isLikePending={Boolean(pendingLikeIds[item.id])}
        />
      ),
    [onCommentPress, onLikePress, pendingLikeIds],
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

  if (query.isError) {
    return (
      <View style={styles.screen}>
        <PostsFeedError onRetry={() => void query.refetch()} />
      </View>
    );
  }

  const onTierPress = useCallback((tier: FeedTier) => {
    setSelectedTier(tier);
  }, []);

  const onFilterLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0) {
      setFilterWidth(width);
    }
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.filterWrap} onLayout={onFilterLayout}>
        {tabWidth > 0 ? (
          <Animated.View
            style={[styles.filterIndicator, { width: tabWidth }, indicatorStyle]}
          />
        ) : null}
        {TIER_FILTERS.map((item) => {
          const isActive = item.id === selectedTier;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              style={styles.filterTab}
              onPress={() => onTierPress(item.id)}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Animated.FlatList
        key={selectedTier}
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        style={contentAnimatedStyle}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching}
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
