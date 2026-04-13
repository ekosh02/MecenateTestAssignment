import type { LayoutChangeEvent } from "react-native";

export type PostsHeaderProps = {
  onLogoLayout: (event: LayoutChangeEvent) => void;
  showLogo?: boolean;
};
