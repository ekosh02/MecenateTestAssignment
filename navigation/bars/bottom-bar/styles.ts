import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";
import { BOTTOM_BAR_BRAND_HEADER_HORIZONTAL_PADDING } from "./constants";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  brandHeader: {
    paddingHorizontal: BOTTOM_BAR_BRAND_HEADER_HORIZONTAL_PADDING,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EBF0",
  },
  splashBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.BACKGROUND,
    zIndex: 8,
  },
});
