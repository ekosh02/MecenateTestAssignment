import type { Post } from "@/lib/posts-api";

export interface SkeletonRow {
  kind: "skeleton";
  id: string;
}

export type FeedRow = Post | SkeletonRow;

export function isSkeletonRow(item: FeedRow): item is SkeletonRow {
  return "kind" in item && item.kind === "skeleton";
}
