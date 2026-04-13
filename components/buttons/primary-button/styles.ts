import { StyleSheet } from "react-native";
import {
  PRIMARY_BUTTON_CONTENT_MIN_HEIGHT,
  PRIMARY_BUTTON_MIN_HEIGHT,
} from "./constants";

export const styles = StyleSheet.create({
  pressable: {
    minHeight: PRIMARY_BUTTON_MIN_HEIGHT,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  contentSlot: {
    minHeight: PRIMARY_BUTTON_CONTENT_MIN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  title: {
    fontSize: 16,
    lineHeight: PRIMARY_BUTTON_CONTENT_MIN_HEIGHT,
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
});
