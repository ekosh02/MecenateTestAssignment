import { BRAND_LOGO_TAB_HEADER_SLOT_SIZE } from "@/src/components";
import { Platform, StyleSheet } from "react-native";
import { HEADER_HORIZONTAL_PADDING } from "./constants";

export const styles = StyleSheet.create({
  root: {
    alignSelf: "stretch",
    height: BRAND_LOGO_TAB_HEADER_SLOT_SIZE,
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EBF0",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: BRAND_LOGO_TAB_HEADER_SLOT_SIZE,
  },
  backHit: {
    marginRight: 4,
  },
  brand: {
    flex: 1,
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
    flexShrink: 1,
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
