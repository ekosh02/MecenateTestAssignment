import type { Post } from "@/src/lib";
import type { NativeSyntheticEvent, TextLayoutEventData } from "react-native";

export interface DetailBodyProps {
  post: Post;
  isPaid: boolean;
  expanded: boolean;
  showToggle: boolean;
  onBodyTextLayout: (e: NativeSyntheticEvent<TextLayoutEventData>) => void;
  onToggleExpand: () => void;
}
