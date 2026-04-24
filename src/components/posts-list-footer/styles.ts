import { COLORS } from "@/src/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  loadMore: {
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  loadMoreText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
