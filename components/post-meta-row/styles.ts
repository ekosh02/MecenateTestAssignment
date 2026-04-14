import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0F2F5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  metaItemLiked: {
    backgroundColor: "#FF2B75",
  },
  metaText: {
    fontSize: 13,
    color: "#6B7280",
  },
  metaTextLiked: {
    color: "#FFFFFF",
  },
});
