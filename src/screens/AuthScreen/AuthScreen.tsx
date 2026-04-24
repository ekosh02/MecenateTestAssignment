import {
  BrandLogoMark,
  Input,
  PostsIntroLogoOverlay,
  PrimaryButton,
  TokenCopyCard,
} from "@/src/components";
import { POSTS_API_PATH } from "@/src/constants";
import { useAuthLogoIntro } from "@/src/hooks";
import { apiFetch } from "@/src/lib/api";
import { persistAuthToken } from "@/src/lib/auth-secure-token";
import { authStore } from "@/src/store";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Text, type TextInput, View } from "react-native";
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
          <TokenCopyCard title="Тестовый токен" value={DEFAULT_AUTH_TOKEN} />
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
