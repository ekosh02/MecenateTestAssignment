import {
  PostCard,
  PostsFeedError,
  PostsFeedLoading,
  PostsListFooter,
} from "@/components";
import { fetchPosts, type Post } from "@/lib/posts-api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { FlatList, type ListRenderItem, View } from "react-native";
import { PAGE_SIZE } from "./constants";
import { styles } from "./styles";

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

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item }) => <PostCard post={item} />,
    [],
  );

  const onLoadMore = useCallback(() => {
    void query.fetchNextPage();
  }, [query.fetchNextPage]);

  const onEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query.fetchNextPage, query.hasNextPage, query.isFetchingNextPage]);

  if (query.isPending) {
    return <PostsFeedLoading />;
  }

  if (query.isError) {
    return (
      <PostsFeedError
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList<Post>
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.4}
        onEndReached={onEndReached}
        ListFooterComponent={
          <PostsListFooter
            isFetchingNextPage={query.isFetchingNextPage}
            hasNextPage={Boolean(query.hasNextPage)}
            onLoadMore={onLoadMore}
          />
        }
      />
    </View>
  );
};

export default PostsScreen;
