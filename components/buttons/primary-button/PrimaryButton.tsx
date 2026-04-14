import { COLORS } from "@/constants/colors";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  PRIMARY_BUTTON_ENABLE_TRANSITION_MS,
  PRIMARY_BUTTON_PRESS_COLOR_IN_MS,
  PRIMARY_BUTTON_PRESS_COLOR_OUT_MS,
} from "./constants";
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
  const isPressDisabled = disabled || loading;
  const isMutedSurface = disabled && !loading;

  const enabledBlend = useSharedValue(isMutedSurface ? 0 : 1);
  const pressBlend = useSharedValue(0);

  useEffect(() => {
    enabledBlend.value = withTiming(isMutedSurface ? 0 : 1, {
      duration: PRIMARY_BUTTON_ENABLE_TRANSITION_MS,
    });
  }, [enabledBlend, isMutedSurface]);

  useEffect(() => {
    if (!isPressDisabled) {
      return;
    }
    cancelAnimation(pressBlend);
    pressBlend.value = 0;
  }, [isPressDisabled, pressBlend]);

  const surfaceAnimatedStyle = useAnimatedStyle(() => {
    const enabled = enabledBlend.value;
    const pressed = pressBlend.value;

    const backgroundAtRest = interpolateColor(
      enabled,
      [0, 1],
      [COLORS.PRIMARY_MUTED, COLORS.PRIMARY],
    );

    const backgroundWhenPressed = interpolateColor(
      enabled,
      [0, 1],
      [COLORS.PRIMARY_MUTED_PRESSED, COLORS.PRIMARY_PRESSED],
    );

    return {
      backgroundColor: interpolateColor(
        pressed,
        [0, 1],
        [backgroundAtRest, backgroundWhenPressed],
      ),
    };
  });

  const runPressIn = useCallback(() => {
    if (isPressDisabled) {
      return;
    }
    pressBlend.value = withTiming(1, {
      duration: PRIMARY_BUTTON_PRESS_COLOR_IN_MS,
    });
  }, [isPressDisabled, pressBlend]);

  const runPressOut = useCallback(() => {
    pressBlend.value = withTiming(0, {
      duration: PRIMARY_BUTTON_PRESS_COLOR_OUT_MS,
    });
  }, [pressBlend]);

  return (
    <AnimatedPressable
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isPressDisabled, busy: loading }}
      disabled={isPressDisabled}
      onPress={onPress}
      onPressIn={runPressIn}
      onPressOut={runPressOut}
      style={[styles.pressable, surfaceAnimatedStyle, style]}
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
