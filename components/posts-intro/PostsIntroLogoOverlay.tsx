import { IMAGES } from "@/assets/images";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { postsIntroOverlayStyles } from "./styles";
import { PostsIntroLogoOverlayProps } from "./types";

export function PostsIntroLogoOverlay({
  animatedStyle,
}: PostsIntroLogoOverlayProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[postsIntroOverlayStyles.root, animatedStyle]}
    >
      <Image
        source={IMAGES.LOGO}
        style={postsIntroOverlayStyles.image}
        contentFit="contain"
      />
    </Animated.View>
  );
}
