import { CommentIcon, LikeIcon } from "@/assets/icons";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { styles } from "./styles";
import type { PostCardProps } from "./types";

const PostCard = ({
  post,
  coverAspectRatio,
  coverImageRef,
}: PostCardProps) => (
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
    <Image
      source={coverImageRef ?? { uri: post.coverUrl }}
      style={[styles.cover, { aspectRatio: coverAspectRatio }]}
      contentFit="cover"
    />
    <Text style={styles.title}>{post.title}</Text>
    <Text style={styles.preview} numberOfLines={2}>
      {post.preview}
    </Text>
    <View style={styles.meta}>
      <View style={[styles.metaItem, post.isLiked && styles.metaItemLiked]}>
        <LikeIcon filled={post.isLiked} />
        <Text style={[styles.metaText, post.isLiked && styles.metaTextLiked]}>
          {post.likesCount}
        </Text>
      </View>
      <View style={styles.metaItem}>
        <CommentIcon />
        <Text style={styles.metaText}>{post.commentsCount}</Text>
      </View>
    </View>
  </View>
);

export default PostCard;
