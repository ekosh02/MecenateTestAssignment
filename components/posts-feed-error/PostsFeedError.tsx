import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import type { PostsFeedErrorProps } from "./types";

const PostsFeedError = ({ error, onRetry }: PostsFeedErrorProps) => (
  <View style={styles.root}>
    <Text style={styles.message}>
      {error instanceof Error ? error.message : "Ошибка загрузки"}
    </Text>
    <Pressable onPress={onRetry}>
      <Text style={styles.retry}>Повторить</Text>
    </Pressable>
  </View>
);

export default PostsFeedError;
