import { IMAGES } from "@/src/assets/images";
import { PrimaryButton } from "@/src/components/buttons";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  POSTS_FEED_ERROR_DEFAULT_MESSAGE,
  POSTS_FEED_ERROR_LOGO_MAX_WIDTH,
} from "./constants";
import { styles } from "./styles";
import type { PostsFeedErrorProps } from "./types";

const PostsFeedError = ({
  onRetry,
  message,
  applyTopSafeArea = true,
}: PostsFeedErrorProps) => {
  const insets = useSafeAreaInsets();
  const text = message ?? POSTS_FEED_ERROR_DEFAULT_MESSAGE;
  const paddingTop = applyTopSafeArea ? insets.top : 0;
  const paddingBottom = insets.bottom + 16;

  return (
    <View style={[styles.root, { paddingTop, paddingBottom }]}>
      <Image
        source={IMAGES.LOGO}
        style={[
          styles.logo,
          {
            width: POSTS_FEED_ERROR_LOGO_MAX_WIDTH,
            height: POSTS_FEED_ERROR_LOGO_MAX_WIDTH,
          },
        ]}
        contentFit="contain"
      />
      <Text style={styles.message}>{text}</Text>
      <PrimaryButton
        title="Повторить"
        onPress={onRetry}
        style={styles.retryButton}
      />
    </View>
  );
};

export default PostsFeedError;
