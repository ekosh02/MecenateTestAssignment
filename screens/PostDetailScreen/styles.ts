import { StyleSheet } from "react-native";
import { POST_DETAIL_SECTION_V_SPACING } from "./constants";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 28,
  },
  authorHeader: {
    paddingTop: POST_DETAIL_SECTION_V_SPACING,
    paddingBottom: POST_DETAIL_SECTION_V_SPACING,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E5E7EB",
  },
  authorName: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  coverFrame: {
    paddingHorizontal: 16,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
  },
  blurAbs: {
    ...StyleSheet.absoluteFillObject,
  },
  mainBlock: {
    paddingTop: POST_DETAIL_SECTION_V_SPACING,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: POST_DETAIL_SECTION_V_SPACING,
  },
  metaRow: {
    marginBottom: POST_DETAIL_SECTION_V_SPACING,
  },
});
