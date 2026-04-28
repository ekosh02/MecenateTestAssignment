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
  commentsBlock: {
    marginTop: 20,
    gap: 12,
    paddingVertical: 6,
  },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4B5563",
  },
  commentsSortText: {
    fontSize: 14,
    color: "#6D28D9",
  },
  commentComposer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  commentComposerDock: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  commentInput: {
    flex: 1,
    minHeight: 38,
    borderRadius: 19,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  commentsList: {
    gap: 16,
  },
  commentsEmpty: {
    fontSize: 14,
    color: "#6B7280",
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  commentAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D1D5DB",
  },
  commentBody: {
    flex: 1,
    gap: 4,
  },
  commentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 19,
    flex: 1,
  },
  commentDate: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 19,
    color: "#1F2937",
  },
  commentAvatarSkeleton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E5E7EB",
  },
  commentAuthorSkeleton: {
    width: 128,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#E5E7EB",
  },
  commentDateSkeleton: {
    width: 62,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  commentTextSkeletonLong: {
    marginTop: 6,
    width: "100%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  commentTextSkeletonShort: {
    marginTop: 6,
    width: "72%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  commentSendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  commentSendButtonDisabled: {
    opacity: 0.65,
  },
});
