import { authStore } from "@/src/store";
import { useRouter, useSegments } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const AuthGate = observer(function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const segments = useSegments();
  const token = authStore.token;

  useEffect(() => {
    const root = segments[0];
    const inPrivate = root === "(private)";
    const inPublic = root === "(public)";

    if (!token && inPrivate) {
      router.replace("/(public)/auth");
      return;
    }
    if (token && inPublic) {
      router.replace("/(private)/(tabs)");
    }
  }, [token, router, segments]);

  return <>{children}</>;
});

export default AuthGate;
