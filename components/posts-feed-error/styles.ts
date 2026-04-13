import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  message: {
    fontSize: 15,
    color: "#B91C1C",
    textAlign: "center",
    marginBottom: 16,
  },
  retry: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
});
