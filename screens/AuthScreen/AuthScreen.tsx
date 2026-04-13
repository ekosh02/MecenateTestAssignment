import {
  BrandLogoMark,
  Input,
  PostsIntroLogoOverlay,
  PrimaryButton,
} from "@/components";
import { POSTS_API_PATH } from "@/constants/api";
import { COLORS } from "@/constants/colors";
import { useAuthLogoIntro } from "@/hooks";
import { apiFetch } from "@/lib/api";
import { persistAuthToken } from "@/lib/auth-secure-token";
import { authStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, type TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEFAULT_AUTH_TOKEN } from "./constants";
import { styles } from "./styles";

const AuthScreen = () => {
  const [value, setValue] = useState(DEFAULT_AUTH_TOKEN);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const scrollTopPadding = Math.max(insets.top, 16);

  const {
    chromeStyle,
    logoStyle,
    logoTargetRef,
    onLogoTargetLayout,
    showSlotLogo,
  } = useAuthLogoIntro({
    topInset: insets.top,
    scrollTopPadding,
  });

  useEffect(() => {
    if (!showSlotLogo) {
      return;
    }
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [showSlotLogo]);

  const sessionMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await apiFetch(POSTS_API_PATH, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Код ${response.status}`);
      }
      return token;
    },
    onSuccess: async (token) => {
      await persistAuthToken(token);
      authStore.setTokenAfterAuthScreen(token);
    },
  });

  const onSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || sessionMutation.isPending) {
      return;
    }
    sessionMutation.mutate(trimmed);
  };

  const onCopySampleToken = () => {
    void (async () => {
      await Clipboard.setStringAsync(DEFAULT_AUTH_TOKEN);
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      }
    })();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: scrollTopPadding },
      ]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={32}
      bounces={false}
      onScrollBeginDrag={() => {
        inputRef.current?.blur();
      }}
    >
      <Animated.View style={chromeStyle}>
        <View style={styles.logoSection}>
          <View style={styles.logoOuter}>
            <View
              ref={logoTargetRef}
              collapsable={false}
              style={styles.logoInner}
              onLayout={onLogoTargetLayout}
            >
              <BrandLogoMark visible={showSlotLogo} />
            </View>
          </View>
        </View>

        <Text style={styles.headline}>Добро пожаловать</Text>
        <Text style={styles.subheadline}>
          Введите токен доступа, чтобы перейти к ленте и профилю
        </Text>

        <View style={styles.card}>
          <View style={styles.tokenCopyCard}>
            <Text style={styles.tokenCopyTitle}>Тестовый токен</Text>
            <Text selectable style={styles.tokenCopyValue}>
              {DEFAULT_AUTH_TOKEN}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.copyTokenPressable,
                pressed && { opacity: 0.75 },
              ]}
              onPress={onCopySampleToken}
            >
              <Ionicons name="copy-outline" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.copyTokenText}>Скопировать этот токен</Text>
            </Pressable>
          </View>
          <Text style={styles.label}>Токен</Text>
          <Input
            ref={inputRef}
            value={value}
            onChangeText={setValue}
            placeholder="Токен"
            placeholderTextColor="#8C95A8"
            autoCapitalize="none"
            autoCorrect={false}
            selectTextOnFocus
          />

          <PrimaryButton
            title="Продолжить"
            onPress={onSubmit}
            loading={sessionMutation.isPending}
            disabled={!value.trim()}
            style={styles.primaryButton}
          />
          {sessionMutation.isError ? (
            <Text style={styles.errorText}>
              {sessionMutation.error instanceof Error
                ? sessionMutation.error.message
                : "Ошибка запроса"}
            </Text>
          ) : null}
        </View>
      </Animated.View>
      <PostsIntroLogoOverlay animatedStyle={logoStyle} />
    </KeyboardAwareScrollView>
  );
};

export default AuthScreen;
