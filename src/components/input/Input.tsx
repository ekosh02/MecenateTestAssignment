import { COLORS } from "@/src/constants/colors";
import { forwardRef } from "react";
import type { TextInput } from "react-native";
import { TextInput as RNTextInput } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { INPUT_FOCUS_BORDER_DURATION_MS } from "./constants";
import { styles } from "./styles";
import type { InputProps } from "./types";

const BORDER_DEFAULT = "#E8EBF0";

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

const Input = forwardRef<TextInput, InputProps>(function Input(
  { style, onFocus, onBlur, ...rest },
  ref,
) {
  const focusProgress = useSharedValue(0);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [BORDER_DEFAULT, COLORS.PRIMARY],
    ),
  }));

  return (
    <AnimatedTextInput
      ref={ref}
      style={[styles.field, animatedBorderStyle, style]}
      onFocus={(e) => {
        focusProgress.value = withTiming(1, {
          duration: INPUT_FOCUS_BORDER_DURATION_MS,
        });
        onFocus?.(e);
      }}
      onBlur={(e) => {
        focusProgress.value = withTiming(0, {
          duration: INPUT_FOCUS_BORDER_DURATION_MS,
        });
        onBlur?.(e);
      }}
      {...rest}
    />
  );
});

export default Input;
