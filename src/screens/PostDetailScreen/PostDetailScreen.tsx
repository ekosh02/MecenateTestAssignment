import {
  BODY_COLLAPSED_LINES,
  DetailBody,
  Header,
  Input,
  PostMetaRow,
  PostsFeedError,
} from "@/src/components";
import {
  COVER_IMAGE_FALLBACK_ASPECT_RATIO,
  PAID_CONTENT_BLUR_INTENSITY,
} from "@/src/components/post-card/constants";
import { COLORS } from "@/src/constants/colors";
import {
  COMMENTS_SKELETON_COUNT,
  usePostComments,
  usePostCoverImage,
  usePostRealtime,
} from "@/src/hooks";
import {
  POSTS_FEED_PAGE_SIZE,
  POSTS_FEED_QUERY_KEY,
  POSTS_FEED_TIER,
  fetchPosts,
  findPostInFeedPages,
  togglePostLike,
  updatePostLikeInFeed,
  type Post,
  type PostComment,
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  type TextLayoutEventData,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { POST_DETAIL_SAFE_TOP_EXTRA } from "./constants";
import { styles } from "./styles";

const PostDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const { id: idParam, focusComments: focusCommentsParam } =
    useLocalSearchParams<{ id?: string | string[]; focusComments?: string | string[] }>();
  const id = normalizeRouteParam(idParam);
  const focusComments = normalizeRouteParam(focusCommentsParam) === "1";
  const queryClient = useQueryClient();
  const scrollRef = useRef<ScrollView | null>(null);
  const [commentsTopY, setCommentsTopY] = useState<number | null>(null);
  const [didAutoScrollToComments, setDidAutoScrollToComments] = useState(false);
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
    setDidAutoScrollToComments(false);
  }, [id]);

  useEffect(() => {
    if (!focusComments || commentsTopY === null || didAutoScrollToComments) {
      return;
    }
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, commentsTopY - 12),
        animated: true,
      });
      setDidAutoScrollToComments(true);
    }, 80);
    return () => clearTimeout(timer);
  }, [commentsTopY, didAutoScrollToComments, focusComments]);

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
      updatePostLikeInFeed(queryClient, postId, nextIsLiked, nextLikesCount);
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
      updatePostLikeInFeed(queryClient, postId, result.isLiked, result.likesCount);
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

  const {
    commentsQuery,
    comments,
    commentsTitle,
    commentText,
    setCommentText,
    onCommentSubmit,
    canSubmitComment,
    onCommentsScroll,
    isCommentSubmitPending,
    maxCommentLength,
  } = usePostComments({ postId: post?.id, queryClient });

  usePostRealtime({ postId: id, queryClient });

  const formatCommentDate = useCallback((value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return "";
    }
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  }, []);

  const refreshing = feedQuery.isRefetching || commentsQuery.isRefetching;
  const keyboardVerticalOffset = -6;

  const onRefresh = useCallback(() => {
    void Promise.all([feedQuery.refetch(), commentsQuery.refetch()]);
  }, [commentsQuery, feedQuery]);

  const onCommentsBlockLayout = useCallback((event: LayoutChangeEvent) => {
    setCommentsTopY(event.nativeEvent.layout.y);
  }, []);

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
    <KeyboardAvoidingView
      style={[
        styles.screen,
        { paddingTop: insets.top + POST_DETAIL_SAFE_TOP_EXTRA },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={onCommentsScroll}
        scrollEventThrottle={16}
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
          <View style={styles.commentsBlock} onLayout={onCommentsBlockLayout}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>{commentsTitle}</Text>
              <Pressable accessibilityRole="button">
                <Text style={styles.commentsSortText}>Сначала новые</Text>
              </Pressable>
            </View>

            {commentsQuery.isPending ? (
              <View style={styles.commentsList}>
                {Array.from({ length: COMMENTS_SKELETON_COUNT }, (_, index) => (
                  <View
                    key={`comment-skeleton-${index}`}
                    style={styles.commentItem}
                  >
                    <View style={styles.commentAvatarSkeleton} />
                    <View style={styles.commentBody}>
                      <View style={styles.commentTopRow}>
                        <View style={styles.commentAuthorSkeleton} />
                        <View style={styles.commentDateSkeleton} />
                      </View>
                      <View style={styles.commentTextSkeletonLong} />
                      <View style={styles.commentTextSkeletonShort} />
                    </View>
                  </View>
                ))}
              </View>
            ) : commentsQuery.isError ? (
              <PostsFeedError
                applyTopSafeArea={false}
                onRetry={() => void commentsQuery.refetch()}
              />
            ) : (
              <View style={styles.commentsList}>
                {comments.length === 0 ? (
                  <Text style={styles.commentsEmpty}>
                    Комментариев пока нет
                  </Text>
                ) : (
                  comments.map((comment: PostComment) => (
                    <View key={comment.id} style={styles.commentItem}>
                      <Image
                        source={
                          comment.author.avatarUrl
                            ? { uri: comment.author.avatarUrl }
                            : undefined
                        }
                        style={styles.commentAvatar}
                        contentFit="cover"
                      />
                      <View style={styles.commentBody}>
                        <View style={styles.commentTopRow}>
                          <Text style={styles.commentAuthor} numberOfLines={1}>
                            {comment.author.displayName}
                          </Text>
                          <Text style={styles.commentDate}>
                            {formatCommentDate(comment.createdAt)}
                          </Text>
                        </View>
                        <Text style={styles.commentText}>{comment.text}</Text>
                      </View>
                    </View>
                  ))
                )}
                {commentsQuery.hasNextPage ? (
                  <View style={styles.commentsList}>
                    {commentsQuery.isFetchingNextPage
                      ? Array.from(
                          { length: COMMENTS_SKELETON_COUNT - 1 },
                          (_, index) => (
                            <View
                              key={`comment-next-skeleton-${index}`}
                              style={styles.commentItem}
                            >
                              <View style={styles.commentAvatarSkeleton} />
                              <View style={styles.commentBody}>
                                <View style={styles.commentTopRow}>
                                  <View style={styles.commentAuthorSkeleton} />
                                  <View style={styles.commentDateSkeleton} />
                                </View>
                                <View style={styles.commentTextSkeletonLong} />
                                <View style={styles.commentTextSkeletonShort} />
                              </View>
                            </View>
                          ),
                        )
                      : null}
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View
        style={[styles.commentComposerDock, { paddingBottom: insets.bottom }]}
      >
        <View style={styles.commentComposer}>
          <Input
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Ваш комментарий"
            placeholderTextColor="#6B7280"
            maxLength={maxCommentLength}
            style={styles.commentInput}
            editable={!isCommentSubmitPending}
          />
          <Pressable
            accessibilityRole="button"
            onPress={onCommentSubmit}
            disabled={!canSubmitComment}
            style={[
              styles.commentSendButton,
              !canSubmitComment && styles.commentSendButtonDisabled,
            ]}
          >
            <Ionicons
              name="send"
              size={18}
              color={canSubmitComment ? COLORS.PRIMARY : "#A78BFA"}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetailScreen;
