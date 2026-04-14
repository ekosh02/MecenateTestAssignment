import { PrimaryButton } from "@/components/buttons";
import { PostMetaRow } from "@/components/post-meta-row";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import {
  PAID_CONTENT_BLUR_INTENSITY,
  PAID_COVER_OVERLAY_DONATE_LABEL,
  PAID_COVER_OVERLAY_LINE1,
  PAID_COVER_OVERLAY_LINE2,
} from "./constants";
import { styles } from "./styles";
import type { PostCardProps } from "./types";

const PostCard = ({
  post,
  coverAspectRatio,
  coverImageRef,
  onDonatePress,
}: PostCardProps) => {
  const isPaid = post.tier === "paid";

  return (
    <View style={styles.root}>
      <View style={styles.authorHeader}>
        <Image
          source={{ uri: post.author.avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
        />
        <Text style={styles.authorName} numberOfLines={1}>
          {post.author.displayName}
        </Text>
        {post.author.isVerified && (
          <Ionicons name="checkmark-circle" size={20} color={COLORS.PRIMARY} />
        )}
      </View>
      <View style={[styles.coverFrame, { aspectRatio: coverAspectRatio }]}>
        <Image
          source={coverImageRef ?? { uri: post.coverUrl }}
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
        {isPaid ? (
          <View style={styles.paidCoverOverlay} pointerEvents="box-none">
            <View style={styles.paidCoverInner}>
              <View style={styles.paidCoverIconOuter}>
                <View style={styles.paidCoverIconInner}>
                  <Text style={styles.paidCoverIconGlyph}>$</Text>
                </View>
              </View>
              <View style={styles.paidCoverTexts}>
                <Text style={styles.paidCoverLine1}>
                  {PAID_COVER_OVERLAY_LINE1}
                </Text>
                <Text style={styles.paidCoverLine2}>
                  {PAID_COVER_OVERLAY_LINE2}
                </Text>
              </View>
              <PrimaryButton
                title={PAID_COVER_OVERLAY_DONATE_LABEL}
                onPress={() => {
                  onDonatePress?.();
                }}
                style={styles.paidCoverButton}
              />
            </View>
          </View>
        ) : null}
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.titleText}>{post.title}</Text>
        {isPaid ? (
          <BlurView
            intensity={PAID_CONTENT_BLUR_INTENSITY}
            tint="light"
            style={styles.blurAbs}
          />
        ) : null}
      </View>
      <View style={styles.previewBlock}>
        <Text style={styles.previewText} numberOfLines={2}>
          {post.preview}
        </Text>
        {isPaid ? (
          <BlurView
            intensity={PAID_CONTENT_BLUR_INTENSITY}
            tint="light"
            style={styles.blurAbs}
          />
        ) : null}
      </View>
      <PostMetaRow
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        isLiked={post.isLiked}
        style={{ paddingHorizontal: 13 }}
      />
    </View>
  );
};

export default PostCard;
