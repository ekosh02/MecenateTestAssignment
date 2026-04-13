import { COLORS } from "@/constants/colors";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { styles } from "./styles";
import type { PostsListFooterProps } from "./types";

const PostsListFooter = ({
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: PostsListFooterProps) => {
  if (isFetchingNextPage) {
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={COLORS.PRIMARY} />
      </View>
    );
  }
  if (hasNextPage) {
    return (
      <Pressable style={styles.loadMore} onPress={onLoadMore}>
        <Text style={styles.loadMoreText}>Загрузить ещё</Text>
      </Pressable>
    );
  }
  return null;
};

export default PostsListFooter;
