import { COLORS } from "@/constants/colors";
import { ActivityIndicator, View } from "react-native";
import { styles } from "./styles";

const PostsFeedLoading = () => (
  <View style={styles.root}>
    <ActivityIndicator size="large" color={COLORS.PRIMARY} />
  </View>
);

export default PostsFeedLoading;
