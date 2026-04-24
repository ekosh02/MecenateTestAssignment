import { COLORS } from "@/src/constants/colors";
import { Platform, StyleSheet } from "react-native";

const TOKEN_MONO_FONT = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

export const styles = StyleSheet.create({
  root: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDE9FE",
    backgroundColor: "#FAF5FF",
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.PRIMARY,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  value: {
    fontSize: 12,
    lineHeight: 18,
    color: "#1F2937",
    fontFamily: TOKEN_MONO_FONT,
    marginBottom: 12,
  },
  copyPressable: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginHorizontal: -4,
    borderRadius: 8,
  },
  copyLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
});
