import { IMAGES } from "@/assets/images";
import { Input, PrimaryButton } from "@/components";
import { COLORS } from "@/constants/colors";
import { persistAuthToken } from "@/lib/auth-secure-token";
import { authStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, type TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEFAULT_AUTH_TOKEN } from "./constants";
import { styles } from "./styles";

const AuthScreen = () => {
  const [value, setValue] = useState(DEFAULT_AUTH_TOKEN);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const onSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || submitting) {
      return;
    }
    void (async () => {
      setSubmitting(true);
      try {
        await persistAuthToken(trimmed);
        authStore.setToken(trimmed);
      } finally {
        setSubmitting(false);
      }
    })();
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
        { paddingTop: Math.max(insets.top, 16) },
      ]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={32}
      bounces={false}
      onScrollBeginDrag={() => {
        inputRef.current?.blur();
      }}
    >
      <View>
        <View style={styles.logoSection}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Image
                source={IMAGES.LOGO}
                style={styles.logoImage}
                contentFit="contain"
              />
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
            loading={submitting}
            disabled={!value.trim()}
            style={styles.primaryButton}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AuthScreen;
