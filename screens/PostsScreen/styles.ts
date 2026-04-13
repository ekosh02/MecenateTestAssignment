import { StyleSheet } from "react-native";
import { SCREEN_HORIZONTAL_PADDING } from "./constants";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EBF0",
  },
});
