import { BRAND_LOGO_AUTH_SCREEN_SLOT_SIZE } from "@/components/brand/constants";
import {
  HEADER_ENTRY_OFFSET,
  INTRO_HEADER_LOGO_REVEAL_AT,
  INTRO_OVERLAY_FADE_FROM,
  INTRO_PROGRESS_MOVE_END,
  LOGO_GROW_DURATION_MS,
  LOGO_MOVE_DURATION_MS,
  SPLASH_LOGO_SIZE,
  SPLASH_LOGO_START_SIZE,
} from "@/hooks/use-posts-animation/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions, type View } from "react-native";
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
import type { UseAuthLogoIntroParams } from "./types";

export const useAuthLogoIntro = ({
  topInset,
  scrollTopPadding,
}: UseAuthLogoIntroParams) => {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const windowWidth = useSharedValue(width);
  const windowHeight = useSharedValue(height);
  const targetX = useSharedValue(0);
  const targetY = useSharedValue(0);
  const targetW = useSharedValue(BRAND_LOGO_AUTH_SCREEN_SLOT_SIZE);
  const targetH = useSharedValue(BRAND_LOGO_AUTH_SCREEN_SLOT_SIZE);
  const logoTargetRef = useRef<View>(null);
  const [showSlotLogo, setShowSlotLogo] = useState(false);

  useEffect(() => {
    windowWidth.value = width;
    windowHeight.value = height;
  }, [width, height, windowWidth, windowHeight]);

  useEffect(() => {
    targetW.value = BRAND_LOGO_AUTH_SCREEN_SLOT_SIZE;
    targetH.value = BRAND_LOGO_AUTH_SCREEN_SLOT_SIZE;
    targetX.value = (width - BRAND_LOGO_AUTH_SCREEN_SLOT_SIZE) / 2;
    targetY.value = topInset + scrollTopPadding + 96;
  }, [width, topInset, scrollTopPadding, targetX, targetY, targetW, targetH]);

  const revealSlotLogo = useCallback(() => {
    setShowSlotLogo(true);
  }, []);

  useEffect(() => {
    setShowSlotLogo(false);
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
            runOnJS(revealSlotLogo)();
          }
        },
      ),
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [progress, revealSlotLogo]);

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
        runOnJS(revealSlotLogo)();
      }
    },
    [revealSlotLogo],
  );

  const onLogoTargetLayout = useCallback(() => {
    requestAnimationFrame(() => {
      logoTargetRef.current?.measureInWindow((x, y, w, h) => {
        if (w > 0 && h > 0) {
          targetX.value = x;
          targetY.value = y;
          targetW.value = w;
          targetH.value = h;
        }
      });
    });
  }, [targetX, targetY, targetW, targetH]);

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

  const chromeStyle = useAnimatedStyle(() => {
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

  return {
    chromeStyle,
    logoStyle,
    logoTargetRef,
    onLogoTargetLayout,
    showSlotLogo,
  };
};
