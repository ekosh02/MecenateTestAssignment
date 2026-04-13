import { POSTS_API_PATH } from "@/constants/api";
import { apiJson } from "@/lib/api";

export interface PostAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  subscribersCount: number;
  isVerified: boolean;
}

export interface Post {
  id: string;
  author: PostAuthor;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: "free" | "paid";
  createdAt: string;
}

export type GetPostsParams = {
  limit?: number;
  cursor?: string;
  tier?: "free" | "paid";
  simulate_error?: boolean;
};

export interface PostsResponse {
  ok?: boolean;
  data: {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export function buildPostsPath(params: GetPostsParams = {}): string {
  const search = new URLSearchParams();
  if (params.limit !== undefined) {
    search.set("limit", String(params.limit));
  }
  if (params.cursor !== undefined && params.cursor.length > 0) {
    search.set("cursor", params.cursor);
  }
  if (params.tier !== undefined) {
    search.set("tier", params.tier);
  }
  if (params.simulate_error === true) {
    search.set("simulate_error", "true");
  }
  const query = search.toString();
  return query.length > 0 ? `${POSTS_API_PATH}?${query}` : POSTS_API_PATH;
}

export async function fetchPosts(params: GetPostsParams): Promise<PostsResponse> {
  const body = await apiJson<PostsResponse>(buildPostsPath(params));
  if (body.ok === false) {
    throw new Error("Ответ posts: ok — false");
  }
  return body;
}
