import { IMAGES } from "@/src/assets/images";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { styles } from "./styles";
import type { PostsIntroLogoOverlayProps } from "./types";

export function PostsIntroLogoOverlay({
  animatedStyle,
}: PostsIntroLogoOverlayProps) {
  return (
    <Animated.View pointerEvents="none" style={[styles.root, animatedStyle]}>
      <Image source={IMAGES.LOGO} style={styles.image} contentFit="contain" />
    </Animated.View>
  );
}
