import { IMAGES } from "@/assets/images";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SPLASH_TIMEOUT_MS } from "./constants";

const PostsScreen = () => {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setShowSplash(false), SPLASH_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <View style={styles.container}>
      {showSplash ? (
        <Image source={IMAGES.LOGO} style={styles.logo} contentFit="contain" />
      ) : (
        <View style={styles.main}>
          <Text style={styles.title}>Post Screen</Text>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/post-detail")}
          >
            <Text style={styles.buttonLabel}>Open post detail</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default PostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 220,
    height: 220,
  },
  main: {
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#111",
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
