import { COLORS } from "@/constants/colors";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { PRIMARY_BUTTON_ENABLE_TRANSITION_MS } from "./constants";
import { styles } from "./styles";
import type { PrimaryButtonProps } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PrimaryButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
}: PrimaryButtonProps) => {
  const blocked = disabled || loading;
  const dimmed = disabled && !loading;
  const enabledProgress = useSharedValue(dimmed ? 0 : 1);

  useEffect(() => {
    enabledProgress.value = withTiming(dimmed ? 0 : 1, {
      duration: PRIMARY_BUTTON_ENABLE_TRANSITION_MS,
    });
  }, [dimmed, enabledProgress]);

  const animatedSurfaceStyle = useAnimatedStyle(() => {
    const t = enabledProgress.value;
    return {
      backgroundColor: interpolateColor(
        t,
        [0, 1],
        [COLORS.PRIMARY_MUTED, COLORS.PRIMARY],
      ),
    };
  });

  return (
    <AnimatedPressable
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onPress={onPress}
      style={[styles.pressable, animatedSurfaceStyle, style]}
    >
      <View style={styles.contentSlot}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
};

export default PrimaryButton;
