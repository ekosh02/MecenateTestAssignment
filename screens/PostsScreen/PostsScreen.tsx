import {
  PostCardSkeleton,
  PostListRow,
  PostsFeedError,
  PostsListFooter,
} from "@/components";
import { COLORS } from "@/constants/colors";
import { fetchPosts } from "@/lib/posts-api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
  FlatList,
  type ListRenderItem,
  RefreshControl,
  View,
} from "react-native";
import { PAGE_SIZE, SKELETON_PLACEHOLDER_COUNT } from "./constants";
import { styles } from "./styles";
import { type FeedRow, isSkeletonRow } from "./types";

const PostsScreen = () => {
  const query = useInfiniteQuery({
    queryKey: ["posts", "feed", { limit: PAGE_SIZE, tier: "free" as const }],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      fetchPosts({
        limit: PAGE_SIZE,
        cursor: pageParam,
        tier: "free",
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
    (!query.isPending && query.isFetching && !query.isFetchingNextPage);

  const listData: FeedRow[] = showFeedSkeleton ? skeletonRows : posts;

  const keyExtractor = useCallback((item: FeedRow) => item.id, []);

  const renderItem = useCallback<ListRenderItem<FeedRow>>(
    ({ item }) =>
      isSkeletonRow(item) ? <PostCardSkeleton /> : <PostListRow post={item} />,
    [],
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

  const refreshing =
    !query.isPending && query.isFetching && !query.isFetchingNextPage;

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
