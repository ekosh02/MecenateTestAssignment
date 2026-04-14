import type { StyleProp, ViewStyle } from "react-native";

export interface PostMetaRowProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  style?: StyleProp<ViewStyle>;
}
