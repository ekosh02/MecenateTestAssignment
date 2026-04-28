import type { StyleProp, ViewStyle } from "react-native";

export interface PostMetaRowProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onLikePress?: () => void;
  onCommentPress?: () => void;
  isLikePending?: boolean;
  style?: StyleProp<ViewStyle>;
}
