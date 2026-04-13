import type { LayoutChangeEvent } from "react-native";

export interface BottomBarHeaderProps {
  title: string;
  onLogoLayout: (event: LayoutChangeEvent) => void;
  showLogo: boolean;
}
