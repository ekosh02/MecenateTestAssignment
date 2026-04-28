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
  iconWrap: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconLayer: {
    position: "absolute",
  },
  metaText: {
    fontSize: 13,
    color: "#6B7280",
  },
});
