import { Platform, StyleSheet } from "react-native";
import { SCREEN_HORIZONTAL_PADDING } from "./constants";

const LOGOUT_SHADOW = Platform.select({
  ios: {
    shadowColor: "#B91C1C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  android: {
    elevation: 2,
  },
  default: {},
});

export const styles = StyleSheet.create({
  screen: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#FECACA",
    backgroundColor: "#FFFFFF",
    ...LOGOUT_SHADOW,
  },
  logoutButtonPressed: {
    backgroundColor: "#FEF2F2",
    borderColor: "#F87171",
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B91C1C",
    letterSpacing: 0.2,
  },
});
