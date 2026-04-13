import { Platform, StyleSheet } from "react-native";
import { HEADER_LOGO_SIZE } from "./constants";

export const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  logoSlot: {
    width: HEADER_LOGO_SIZE,
    height: HEADER_LOGO_SIZE,
    borderRadius: 18,
    overflow: "hidden",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  logoPlaceholder: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 22,
    color: "#111827",
    paddingVertical: 0,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
});
