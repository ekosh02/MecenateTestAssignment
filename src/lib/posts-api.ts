import { POSTS_API_PATH } from "@/src/constants/api";
import { apiFetch, apiJson } from "@/src/lib/api";

export const POSTS_FEED_PAGE_SIZE = 10;
export const POSTS_FEED_TIER = "free" as const;
export const POSTS_FEED_QUERY_KEY = [
  "posts",
  "feed",
  { limit: POSTS_FEED_PAGE_SIZE, tier: POSTS_FEED_TIER },
] as const;

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

export interface GetPostsParams {
  limit?: number;
  cursor?: string;
  tier?: "free" | "paid";
  simulate_error?: boolean;
}

export interface PostsResponse {
  ok?: boolean;
  data: {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface PostDetailResponse {
  ok?: boolean;
  data: {
    post: Post;
  };
}

export interface TogglePostLikeResult {
  isLiked?: boolean;
  likesCount?: number;
}

export interface PostCommentAuthor {
  id: string;
  username?: string;
  displayName: string;
  avatarUrl?: string;
}

export interface PostComment {
  id: string;
  postId: string;
  text: string;
  createdAt: string;
  author: PostCommentAuthor;
}

export interface PostCommentsResponse {
  ok?: boolean;
  data: {
    comments: PostComment[];
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

export async function fetchPosts(
  params: GetPostsParams,
): Promise<PostsResponse> {
  const body = await apiJson<PostsResponse>(buildPostsPath(params));
  if (body.ok === false) {
    throw new Error("Ответ posts: ok — false");
  }
  return body;
}

export async function fetchPostById(postId: string): Promise<PostDetailResponse> {
  const body = await apiJson<PostDetailResponse>(`${POSTS_API_PATH}/${postId}`);
  if (body.ok === false) {
    throw new Error("Ответ post detail: ok — false");
  }
  return body;
}

export async function togglePostLike(postId: string): Promise<TogglePostLikeResult> {
  const response = await apiFetch(`${POSTS_API_PATH}/${postId}/like`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const text = await response.text();
  if (text.length === 0) {
    return {};
  }

  try {
    const body = JSON.parse(text) as {
      data?: { isLiked?: boolean; likesCount?: number };
      isLiked?: boolean;
      likesCount?: number;
    };
    return {
      isLiked: body.data?.isLiked ?? body.isLiked,
      likesCount: body.data?.likesCount ?? body.likesCount,
    };
  } catch {
    return {};
  }
}

export async function fetchPostComments(params: {
  postId: string;
  limit?: number;
  cursor?: string;
}): Promise<PostCommentsResponse> {
  const search = new URLSearchParams();
  if (params.limit !== undefined) {
    search.set("limit", String(params.limit));
  }
  if (params.cursor !== undefined && params.cursor.length > 0) {
    search.set("cursor", params.cursor);
  }
  const query = search.toString();
  const path = `${POSTS_API_PATH}/${params.postId}/comments${query.length > 0 ? `?${query}` : ""}`;
  const body = await apiJson<PostCommentsResponse>(path);
  if (body.ok === false) {
    throw new Error("Ответ comments: ok — false");
  }
  return body;
}

export async function addPostComment(params: {
  postId: string;
  text: string;
}): Promise<{ comment?: PostComment }> {
  const body = await apiJson<{ data?: { comment?: PostComment }; comment?: PostComment }>(
    `${POSTS_API_PATH}/${params.postId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ text: params.text }),
    },
  );
  return { comment: body.data?.comment ?? body.comment };
}

export function findPostInFeedPages(
  pages: PostsResponse[] | undefined,
  id: string,
): Post | undefined {
  if (pages === undefined) {
    return undefined;
  }
  for (const page of pages) {
    const found = page.data.posts.find((p) => p.id === id);
    if (found !== undefined) {
      return found;
    }
  }
  return undefined;
}
