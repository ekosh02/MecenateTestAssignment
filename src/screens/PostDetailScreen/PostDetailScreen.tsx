import {
  BODY_COLLAPSED_LINES,
  DetailBody,
  Header,
  PostMetaRow,
  PostsFeedError,
} from "@/src/components";
import {
  COVER_IMAGE_FALLBACK_ASPECT_RATIO,
  PAID_CONTENT_BLUR_INTENSITY,
} from "@/src/components/post-card/constants";
import { COLORS } from "@/src/constants/colors";
import { usePostCoverImage } from "@/src/hooks/use-post-cover-image";
import {
  findPostInFeedPages,
  POSTS_FEED_PAGE_SIZE,
  POSTS_FEED_QUERY_KEY,
  POSTS_FEED_TIER,
  fetchPosts,
  togglePostLike,
  type Post,
  type PostsResponse,
} from "@/src/lib";
import { normalizeRouteParam } from "@/src/lib/normalize-route-param";
import { Ionicons } from "@expo/vector-icons";
import type { InfiniteData } from "@tanstack/react-query";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  type NativeSyntheticEvent,
  type TextLayoutEventData,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { POST_DETAIL_SAFE_TOP_EXTRA } from "./constants";
import { styles } from "./styles";

const PostDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const { id: idParam } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = normalizeRouteParam(idParam);
  const queryClient = useQueryClient();
  const feedQuery = useInfiniteQuery({
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

  const post = useMemo((): Post | undefined => {
    if (id === undefined) {
      return undefined;
    }
    return findPostInFeedPages(feedQuery.data?.pages, id);
  }, [feedQuery.data?.pages, id]);

  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [isLikePending, setIsLikePending] = useState(false);

  useEffect(() => {
    setExpanded(false);
    setShowToggle(false);
  }, [id]);

  const onBodyTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (!expanded && e.nativeEvent.lines.length >= BODY_COLLAPSED_LINES) {
        setShowToggle(true);
      }
    },
    [expanded],
  );

  const toggleExpanded = useCallback(() => setExpanded((v) => !v), []);
  const handleBack = useCallback(() => router.back(), []);
  const cover = usePostCoverImage(post?.coverUrl ?? "");

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
                posts: page.data.posts.map((item) =>
                  item.id === postId ? { ...item, isLiked, likesCount } : item,
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
      const previousFeed = queryClient.getQueryData<
        InfiniteData<PostsResponse>
      >([...POSTS_FEED_QUERY_KEY]);
      const currentPost = previousFeed?.pages
        .flatMap((page) => page.data.posts)
        .find((item) => item.id === postId);
      if (currentPost === undefined) {
        return { previousFeed, postId };
      }
      const nextIsLiked = !currentPost.isLiked;
      const nextLikesCount = Math.max(
        0,
        currentPost.likesCount + (nextIsLiked ? 1 : -1),
      );
      setPostLikeState(postId, nextIsLiked, nextLikesCount);
      setIsLikePending(true);
      return { previousFeed, postId };
    },
    onError: (_error, _postId, context) => {
      if (context?.previousFeed !== undefined) {
        queryClient.setQueryData(
          [...POSTS_FEED_QUERY_KEY],
          context.previousFeed,
        );
      }
    },
    onSuccess: (result, postId) => {
      if (result.isLiked === undefined || result.likesCount === undefined) {
        return;
      }
      setPostLikeState(postId, result.isLiked, result.likesCount);
    },
    onSettled: () => {
      setIsLikePending(false);
    },
  });

  const onLikePress = useCallback(() => {
    if (post === undefined || isLikePending) {
      return;
    }
    likeMutation.mutate(post.id);
  }, [isLikePending, likeMutation, post]);

  if (post === undefined) {
    return (
      <View
        style={[
          styles.screen,
          { paddingTop: insets.top + POST_DETAIL_SAFE_TOP_EXTRA },
        ]}
      >
        <Header title="Пост" showLogo={false} onBackPress={handleBack} />
        <PostsFeedError
          applyTopSafeArea={false}
          onRetry={() => {
            void feedQuery.refetch();
          }}
        />
      </View>
    );
  }

  const isPaid = post.tier === "paid";
  const coverReady = cover.status === "ready";
  const coverAspectRatio = coverReady
    ? cover.aspectRatio
    : COVER_IMAGE_FALLBACK_ASPECT_RATIO;
  const coverSource = coverReady ? cover.coverImage : { uri: post.coverUrl };

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + POST_DETAIL_SAFE_TOP_EXTRA },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header title={post.title} showLogo={false} onBackPress={handleBack} />
        <View style={styles.authorHeader}>
          <Image
            source={{ uri: post.author.avatarUrl }}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={styles.authorName} numberOfLines={1}>
            {post.author.displayName}
          </Text>
          {post.author.isVerified ? (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.PRIMARY}
            />
          ) : null}
        </View>
        <View style={[styles.coverFrame, { aspectRatio: coverAspectRatio }]}>
          <Image
            source={coverSource}
            style={styles.coverImage}
            contentFit="cover"
          />
          {isPaid ? (
            <BlurView
              intensity={PAID_CONTENT_BLUR_INTENSITY}
              tint="light"
              style={styles.blurAbs}
            />
          ) : null}
        </View>
        <View style={styles.mainBlock}>
          <Text style={styles.title}>{post.title}</Text>
          <PostMetaRow
            likesCount={post.likesCount}
            commentsCount={post.commentsCount}
            isLiked={post.isLiked}
            onLikePress={onLikePress}
            isLikePending={isLikePending}
            style={styles.metaRow}
          />
          <DetailBody
            post={post}
            isPaid={isPaid}
            expanded={expanded}
            showToggle={showToggle}
            onBodyTextLayout={onBodyTextLayout}
            onToggleExpand={toggleExpanded}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetailScreen;
