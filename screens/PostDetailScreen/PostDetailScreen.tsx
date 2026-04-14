import {
  BODY_COLLAPSED_LINES,
  DetailBody,
  Header,
  PostMetaRow,
} from "@/components";
import {
  COVER_IMAGE_FALLBACK_ASPECT_RATIO,
  PAID_CONTENT_BLUR_INTENSITY,
} from "@/components/post-card/constants";
import { COLORS } from "@/constants/colors";
import { usePostCoverImage } from "@/hooks/use-post-cover-image";
import {
  findPostInFeedPages,
  type Post,
  type PostsResponse,
} from "@/lib/posts-api";
import { normalizeRouteParam } from "@/lib/normalize-route-param";
import { Ionicons } from "@expo/vector-icons";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
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
import { POST_DETAIL_SAFE_TOP_EXTRA, POSTS_FEED_QUERY_KEY } from "./constants";
import { styles } from "./styles";

const PostDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const { id: idParam } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = normalizeRouteParam(idParam);
  const queryClient = useQueryClient();

  const post = useMemo((): Post | undefined => {
    if (id === undefined) {
      return undefined;
    }
    return findPostInFeedPages(
      queryClient.getQueryData<InfiniteData<PostsResponse>>([
        ...POSTS_FEED_QUERY_KEY,
      ])?.pages,
      id,
    );
  }, [id, queryClient]);

  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

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

  if (post === undefined) {
    return (
      <View
        style={[styles.screen, { paddingTop: insets.top + POST_DETAIL_SAFE_TOP_EXTRA }]}
      >
        <Header title="Пост" showLogo={false} onBackPress={handleBack} />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Пост не найден</Text>
        </View>
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
      style={[styles.screen, { paddingTop: insets.top + POST_DETAIL_SAFE_TOP_EXTRA }]}
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
            <Ionicons name="checkmark-circle" size={20} color={COLORS.PRIMARY} />
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
