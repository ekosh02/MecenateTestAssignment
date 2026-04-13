import { PostsHeader, PostsIntroLogoOverlay } from "@/components";
import { usePostsAnimation } from "@/hooks";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HEADER_TOP_PADDING, SCREEN_HORIZONTAL_PADDING } from "./constants";
import { styles } from "./styles";

const PostsScreen = () => {
  const insets = useSafeAreaInsets();
  const headerPaddingTop = insets.top + HEADER_TOP_PADDING;

  const { headerStyle, logoStyle, onHeaderLogoLayout, showHeaderLogo } =
    usePostsAnimation({
      topInset: insets.top,
      horizontalPadding: SCREEN_HORIZONTAL_PADDING,
      headerTopPadding: HEADER_TOP_PADDING,
    });

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[styles.header, { paddingTop: headerPaddingTop }, headerStyle]}
      >
        <PostsHeader
          onLogoLayout={onHeaderLogoLayout}
          showLogo={showHeaderLogo}
        />
      </Animated.View>

      <PostsIntroLogoOverlay animatedStyle={logoStyle} />
    </View>
  );
};

export default PostsScreen;
