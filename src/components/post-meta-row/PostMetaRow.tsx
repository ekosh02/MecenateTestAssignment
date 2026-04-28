import { CommentIcon, LikeIcon } from "@/src/assets/icons";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { styles } from "./styles";
import type { PostMetaRowProps } from "./types";

const PostMetaRow = ({
  likesCount,
  commentsCount,
  isLiked,
  onLikePress,
  isLikePending,
  style,
}: PostMetaRowProps) => {
  const likeProgress = useSharedValue(isLiked ? 1 : 0);
  const likeScale = useSharedValue(isLiked ? 1.05 : 1);

  useEffect(() => {
    likeProgress.value = withTiming(isLiked ? 1 : 0, {
      duration: 240,
      easing: Easing.inOut(Easing.cubic),
    });
    likeScale.value = withTiming(isLiked ? 1.12 : 1, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
    likeScale.value = withTiming(1, {
      duration: 180,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [isLiked, likeProgress, likeScale]);

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
    backgroundColor: interpolateColor(
      likeProgress.value,
      [0, 1],
      ["#F0F2F5", "#FF2B75"],
    ),
  }));

  const outlineIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - likeProgress.value,
    transform: [
      {
        translateY: interpolate(likeProgress.value, [0, 1], [0, -7]),
      },
      {
        scale: interpolate(likeProgress.value, [0, 1], [1, 0.85]),
      },
    ],
  }));

  const filledIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: likeProgress.value,
    transform: [
      {
        translateY: interpolate(likeProgress.value, [0, 1], [8, 0]),
      },
      {
        scale: interpolate(likeProgress.value, [0, 1], [0.78, 1]),
      },
    ],
  }));

  const likeTextAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(likeProgress.value, [0, 1], ["#6B7280", "#FFFFFF"]),
  }));

  return (
    <View style={[styles.meta, style]}>
      <Pressable
        accessibilityRole="button"
        onPress={(event) => {
          event.stopPropagation();
          onLikePress?.();
        }}
        disabled={isLikePending}
      >
        <Animated.View
          style={[
            styles.metaItem,
            likeAnimatedStyle,
          ]}
        >
          <View style={styles.iconWrap}>
            <Animated.View style={[styles.iconLayer, outlineIconAnimatedStyle]}>
              <LikeIcon />
            </Animated.View>
            <Animated.View style={[styles.iconLayer, filledIconAnimatedStyle]}>
              <LikeIcon filled />
            </Animated.View>
          </View>
          <Animated.Text style={[styles.metaText, likeTextAnimatedStyle]}>
            {likesCount}
          </Animated.Text>
        </Animated.View>
      </Pressable>
      <View style={styles.metaItem}>
        <CommentIcon />
        <Text style={styles.metaText}>{commentsCount}</Text>
      </View>
    </View>
  );
};

export default PostMetaRow;
