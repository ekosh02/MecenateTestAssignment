import { COLORS } from "@/src/constants";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  filterWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    position: "relative",
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 2,
    backgroundColor: "#F3F4F6",
  },
  filterIndicator: {
    position: "absolute",
    top: 2,
    bottom: 2,
    left: 2,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY,
  },
  filterTab: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#5B6472",
  },
  filterTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContent: {
    gap: 16,
  },
});
