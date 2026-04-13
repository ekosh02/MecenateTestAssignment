import { AuthGate } from "@/components";
import { getSecureAuthToken } from "@/lib/auth-secure-token";
import { authStore } from "@/store";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const token = await getSecureAuthToken();
      if (active) {
        authStore.setToken(token);
      }
      if (active) {
        setHydrated(true);
      }
      void SplashScreen.hideAsync();
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
      <StatusBar style="auto" />
    </>
  );
}
