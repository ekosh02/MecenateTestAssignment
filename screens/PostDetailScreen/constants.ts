import { PAGE_SIZE } from "@/screens/PostsScreen/constants";

export const POST_DETAIL_SECTION_V_SPACING = 12;

export const POST_DETAIL_SAFE_TOP_EXTRA = 8;

export const POSTS_FEED_QUERY_KEY = [
  "posts",
  "feed",
  { limit: PAGE_SIZE, tier: "free" as const },
] as const;
