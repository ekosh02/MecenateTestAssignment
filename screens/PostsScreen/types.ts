export interface PostPreview {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  accentColor: string;
  route: "/post-detail";
}

export interface LogoTargetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PostsContentProps {
  posts: readonly PostPreview[];
  onOpenPost: (post: PostPreview) => void;
}

export interface PostCardProps {
  post: PostPreview;
  onPress: (post: PostPreview) => void;
}
