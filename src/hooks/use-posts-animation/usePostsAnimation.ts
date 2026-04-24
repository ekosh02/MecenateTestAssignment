import { BRAND_LOGO_TAB_HEADER_SLOT_SIZE } from "@/src/components";
import { useCallback, useEffect, useState } from "react";
import { useWindowDimensions, type LayoutChangeEvent } from "react-native";
import {
  Easing,
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  HEADER_ENTRY_OFFSET,
  INTRO_HEADER_LOGO_REVEAL_AT,
  INTRO_OVERLAY_FADE_FROM,
  INTRO_PROGRESS_MOVE_END,
  LOGO_GROW_DURATION_MS,
  LOGO_MOVE_DURATION_MS,
  SPLASH_LOGO_SIZE,
  SPLASH_LOGO_START_SIZE,
} from "./constants";
import type { UsePostsAnimationParams } from "./types";

export const usePostsAnimation = ({
  topInset,
  horizontalPadding,
  headerTopPadding,
  enabled = true,
}: UsePostsAnimationParams) => {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const windowWidth = useSharedValue(width);
  const windowHeight = useSharedValue(height);
  const targetX = useSharedValue(horizontalPadding);
  const targetY = useSharedValue(topInset + headerTopPadding);
  const targetW = useSharedValue(BRAND_LOGO_TAB_HEADER_SLOT_SIZE);
  const targetH = useSharedValue(BRAND_LOGO_TAB_HEADER_SLOT_SIZE);
  const [showHeaderLogo, setShowHeaderLogo] = useState(false);

  useEffect(() => {
    windowWidth.value = width;
    windowHeight.value = height;
  }, [width, height, windowWidth, windowHeight]);

  useEffect(() => {
    targetX.value = horizontalPadding;
    targetY.value = topInset + headerTopPadding;
    targetW.value = BRAND_LOGO_TAB_HEADER_SLOT_SIZE;
    targetH.value = BRAND_LOGO_TAB_HEADER_SLOT_SIZE;
  }, [
    topInset,
    horizontalPadding,
    headerTopPadding,
    targetX,
    targetY,
    targetW,
    targetH,
  ]);

  const revealHeaderLogo = useCallback(() => {
    setShowHeaderLogo(true);
  }, []);

  useEffect(() => {
    if (!enabled) {
      cancelAnimation(progress);
      progress.value = INTRO_PROGRESS_MOVE_END;
      setShowHeaderLogo(true);
      return () => {
        cancelAnimation(progress);
      };
    }

    setShowHeaderLogo(false);
    cancelAnimation(progress);
    progress.value = 0;

    progress.value = withSequence(
      withTiming(1, {
        duration: LOGO_GROW_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(
        INTRO_PROGRESS_MOVE_END,
        {
          duration: LOGO_MOVE_DURATION_MS,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            runOnJS(revealHeaderLogo)();
          }
        },
      ),
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [enabled, progress, revealHeaderLogo]);

  useAnimatedReaction(
    () => progress.value,
    (current, previous) => {
      if (previous === null) {
        return;
      }
      const crossedReveal =
        previous < INTRO_HEADER_LOGO_REVEAL_AT &&
        current >= INTRO_HEADER_LOGO_REVEAL_AT;
      if (crossedReveal) {
        runOnJS(revealHeaderLogo)();
      }
    },
    [revealHeaderLogo],
  );

  const onHeaderLogoLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      targetX.value = horizontalPadding + layout.x;
      targetY.value = topInset + headerTopPadding + layout.y;
      targetW.value = layout.width;
      targetH.value = layout.height;
    },
    [
      topInset,
      horizontalPadding,
      headerTopPadding,
      targetX,
      targetY,
      targetW,
      targetH,
    ],
  );

  const logoStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const ww = windowWidth.value;
    const wh = windowHeight.value;

    if (p <= 1) {
      const w = interpolate(
        p,
        [0, 1],
        [SPLASH_LOGO_START_SIZE, SPLASH_LOGO_SIZE],
      );
      const h = w;
      return {
        left: (ww - w) / 2,
        top: (wh - h) / 2,
        width: w,
        height: h,
        opacity: 1,
      };
    }

    const w = interpolate(
      p,
      [1, INTRO_PROGRESS_MOVE_END],
      [SPLASH_LOGO_SIZE, targetW.value],
    );
    const h = interpolate(
      p,
      [1, INTRO_PROGRESS_MOVE_END],
      [SPLASH_LOGO_SIZE, targetH.value],
    );
    const startLeft = (ww - SPLASH_LOGO_SIZE) / 2;
    const startTop = (wh - SPLASH_LOGO_SIZE) / 2;
    const left = interpolate(
      p,
      [1, INTRO_PROGRESS_MOVE_END],
      [startLeft, targetX.value],
    );
    const top = interpolate(
      p,
      [1, INTRO_PROGRESS_MOVE_END],
      [startTop, targetY.value],
    );

    const overlayOpacity =
      p < INTRO_OVERLAY_FADE_FROM
        ? 1
        : interpolate(
            p,
            [INTRO_OVERLAY_FADE_FROM, INTRO_PROGRESS_MOVE_END],
            [1, 0],
          );

    return {
      left,
      top,
      width: w,
      height: h,
      opacity: overlayOpacity,
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: interpolate(
        p,
        [0, 1, 1.12, INTRO_PROGRESS_MOVE_END],
        [0, 0, 0.45, 1],
      ),
      transform: [
        {
          translateY: interpolate(
            p,
            [1, INTRO_PROGRESS_MOVE_END],
            [HEADER_ENTRY_OFFSET, 0],
          ),
        },
      ],
    };
  });

  const splashBackdropStyle = useAnimatedStyle(() => {
    const p = progress.value;
    if (p <= 1) {
      return { opacity: 1 };
    }
    if (p >= INTRO_PROGRESS_MOVE_END) {
      return { opacity: 0 };
    }
    return {
      opacity: interpolate(p, [1, INTRO_PROGRESS_MOVE_END], [1, 0]),
    };
  });

  return {
    headerStyle,
    logoStyle,
    splashBackdropStyle,
    onHeaderLogoLayout,
    showHeaderLogo,
  };
};
