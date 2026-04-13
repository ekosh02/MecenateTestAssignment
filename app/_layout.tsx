import { AuthGate } from "@/components";
import { getSecureAuthToken } from "@/lib/auth-secure-token";
import { createQueryClient } from "@/lib/query-client";
import { authStore } from "@/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(() => createQueryClient());
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
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthGate>
      </QueryClientProvider>
      <StatusBar style="auto" />
    </>
  );
}
