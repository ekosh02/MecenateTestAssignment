import { BRAND_LOGO_TAB_HEADER_SLOT_SIZE } from "@/components/brand/constants";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoSlot: {
    width: BRAND_LOGO_TAB_HEADER_SLOT_SIZE,
    height: BRAND_LOGO_TAB_HEADER_SLOT_SIZE,
    borderRadius: 14,
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 20,
    color: "#111827",
    paddingVertical: 0,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
});
