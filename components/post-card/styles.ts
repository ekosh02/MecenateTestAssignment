import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
  },
  authorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 10,
    paddingHorizontal: 13,
  },
  cover: {
    width: "100%",
    backgroundColor: "#E5E7EB",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 13,
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
  preview: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    marginBottom: 8,
    paddingHorizontal: 13,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingHorizontal: 13,
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
  skeletonAuthorLine: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#E5E7EB",
    maxWidth: "55%",
  },
  skeletonCoverBlock: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#E5E7EB",
  },
  skeletonTitleLine: {
    height: 18,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginTop: 12,
    marginBottom: 8,
    marginHorizontal: 13,
    width: "78%",
  },
  skeletonPreviewLine: {
    height: 14,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 6,
    marginHorizontal: 13,
  },
  skeletonPreviewLineShort: {
    width: "62%",
  },
  skeletonMetaPill: {
    width: 72,
    height: 34,
    borderRadius: 16,
    backgroundColor: "#F0F2F5",
  },
});
