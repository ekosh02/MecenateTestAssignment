import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bodyBlock: {
    position: "relative",
    overflow: "hidden",
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
  previewText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  toggleText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.PRIMARY,
    alignSelf: "flex-start",
  },
  blurAbs: {
    ...StyleSheet.absoluteFillObject,
  },
});
