import { BRAND_LOGO_AUTH_SCREEN_SLOT_SIZE } from "@/components/brand/constants";
import { COLORS } from "@/constants/colors";
import { Platform, StyleSheet } from "react-native";
import { SCREEN_HORIZONTAL_PADDING } from "./constants";

const TOKEN_MONO_FONT = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: "#1E1B4B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  android: {
    elevation: 6,
  },
  default: {},
});

const LOGO_SHADOW = Platform.select({
  ios: {
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  android: {
    elevation: 8,
  },
  default: {},
});

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    paddingVertical: 32,
    position: "relative",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoOuter: {
    borderRadius: 28,
    padding: 14,
    backgroundColor: "#FFFFFF",
    ...LOGO_SHADOW,
  },
  logoInner: {
    width: BRAND_LOGO_AUTH_SCREEN_SLOT_SIZE,
    height: BRAND_LOGO_AUTH_SCREEN_SLOT_SIZE,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#FAF5FF",
  },
  headline: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subheadline: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  card: {
    marginTop: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#EDE9FE",
    ...CARD_SHADOW,
  },
  label: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  tokenCopyCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDE9FE",
    backgroundColor: "#FAF5FF",
  },
  tokenCopyTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.PRIMARY,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  tokenCopyValue: {
    fontSize: 12,
    lineHeight: 18,
    color: "#1F2937",
    fontFamily: TOKEN_MONO_FONT,
    marginBottom: 12,
  },
  copyTokenPressable: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginHorizontal: -4,
    borderRadius: 8,
  },
  copyTokenText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
  primaryButton: {
    marginTop: 22,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#B91C1C",
  },
});
