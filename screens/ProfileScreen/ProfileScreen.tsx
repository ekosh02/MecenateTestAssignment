import { TokenCopyCard } from "@/components";
import { persistAuthToken } from "@/lib/auth-secure-token";
import { authStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react-lite";
import { Pressable, ScrollView, Text } from "react-native";
import { styles } from "./styles";

const ProfileScreen = observer(function ProfileScreen() {
  const onLogout = async () => {
    await persistAuthToken("");
    authStore.setToken("");
  };

  return (
    <ScrollView style={styles.screen}>
      <TokenCopyCard title="Токен доступа" value={authStore.token} />

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
        <Ionicons name="log-out-outline" size={22} color="#B91C1C" />
        <Text style={styles.logoutLabel}>Выйти из аккаунта</Text>
      </Pressable>
    </ScrollView>
  );
});

export default ProfileScreen;
