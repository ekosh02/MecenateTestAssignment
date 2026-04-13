import { PostsIntroLogoOverlay } from "@/components";
import { usePostsAnimation } from "@/hooks";
import { authStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useSegments } from "expo-router";
import { useRef } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomBarHeader } from "./components";
import {
  BOTTOM_BAR_BRAND_HEADER_HORIZONTAL_PADDING,
  BOTTOM_BAR_BRAND_HEADER_TOP_OFFSET,
} from "./constants";
import { styles } from "./styles";
import { bottomTabScreenOptions } from "./tabBarScreenOptions";

const BottomBar = () => {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const headerPaddingTop = insets.top + BOTTOM_BAR_BRAND_HEADER_TOP_OFFSET;
  const routeTail = segments[segments.length - 1];
  const brandTitle = routeTail === "profile" ? "Profile" : "Posts";

  const tabLogoIntroEnabledRef = useRef(
    authStore.token.length > 0 && !authStore.skipTabLogoIntroAfterAuth,
  );

  const {
    headerStyle,
    logoStyle,
    splashBackdropStyle,
    onHeaderLogoLayout,
    showHeaderLogo,
  } = usePostsAnimation({
    topInset: insets.top,
    horizontalPadding: BOTTOM_BAR_BRAND_HEADER_HORIZONTAL_PADDING,
    headerTopPadding: BOTTOM_BAR_BRAND_HEADER_TOP_OFFSET,
    enabled: tabLogoIntroEnabledRef.current,
  });

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.brandHeader,
          { paddingTop: headerPaddingTop },
          headerStyle,
        ]}
      >
        <BottomBarHeader
          title={brandTitle}
          onLogoLayout={onHeaderLogoLayout}
          showLogo={showHeaderLogo}
        />
      </Animated.View>

      <Tabs screenOptions={bottomTabScreenOptions}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Posts",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {tabLogoIntroEnabledRef.current ? (
        <>
          <Animated.View
            pointerEvents="none"
            style={[styles.splashBackdrop, splashBackdropStyle]}
          />
          <PostsIntroLogoOverlay animatedStyle={logoStyle} />
        </>
      ) : null}
    </View>
  );
};

export default BottomBar;
