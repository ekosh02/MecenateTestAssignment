export type PostPreview = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  accentColor: string;
  route: "/post-detail";
};

export type LogoTargetLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PostsContentProps = {
  posts: readonly PostPreview[];
  onOpenPost: (post: PostPreview) => void;
};

export type PostCardProps = {
  post: PostPreview;
  onPress: (post: PostPreview) => void;
};
