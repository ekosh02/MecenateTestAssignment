import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  logo: {
    marginBottom: 28,
  },
  message: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  retryButton: {
    alignSelf: "stretch",
    maxWidth: 400,
    borderRadius: 28,
    paddingVertical: 16,
  },
});
