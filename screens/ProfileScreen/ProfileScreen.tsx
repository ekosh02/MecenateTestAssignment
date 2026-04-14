import { persistAuthToken } from "@/lib/auth-secure-token";
import { authStore } from "@/store";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();

  const onLogout = async () => {
    await persistAuthToken("");
    authStore.setToken("");
  };

  return (
    <View
      style={[styles.screen, { paddingTop: Math.max(insets.top, 24) + 8 }]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Выйти из аккаунта"
        onPress={() => {
          void onLogout();
        }}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
      >
        <Text style={styles.logoutLabel}>Выйти из аккаунта</Text>
      </Pressable>
    </View>
  );
};

export default ProfileScreen;
