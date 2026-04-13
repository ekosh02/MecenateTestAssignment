import type { LayoutChangeEvent } from "react-native";

export interface PostsHeaderProps {
  onLogoLayout: (event: LayoutChangeEvent) => void;
  showLogo?: boolean;
}
