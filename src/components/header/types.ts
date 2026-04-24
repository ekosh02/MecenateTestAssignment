import type { LayoutChangeEvent } from "react-native";

export interface HeaderProps {
  title: string;
  showLogo: boolean;
  onLogoLayout?: (event: LayoutChangeEvent) => void;
  onBackPress?: () => void;
}
