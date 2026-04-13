import { StyleSheet } from "react-native";
import { SCREEN_HORIZONTAL_PADDING } from "./constants";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
  },
  logoutButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8EBF0",
    alignItems: "center",
  },
  logoutButtonPressed: {
    backgroundColor: "#F9FAFB",
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B91C1C",
  },
});
