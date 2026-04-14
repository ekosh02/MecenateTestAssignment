import { CommentIcon, LikeIcon } from "@/assets/icons";
import { Text, View } from "react-native";
import { styles } from "./styles";
import type { PostMetaRowProps } from "./types";

const PostMetaRow = ({
  likesCount,
  commentsCount,
  isLiked,
  style,
}: PostMetaRowProps) => (
  <View style={[styles.meta, style]}>
    <View style={[styles.metaItem, isLiked && styles.metaItemLiked]}>
      <LikeIcon filled={isLiked} />
      <Text style={[styles.metaText, isLiked && styles.metaTextLiked]}>
        {likesCount}
      </Text>
    </View>
    <View style={styles.metaItem}>
      <CommentIcon />
      <Text style={styles.metaText}>{commentsCount}</Text>
    </View>
  </View>
);

export default PostMetaRow;
