import { styles as postMetaRowStyles } from "@/src/components";
import { View } from "react-native";
import { styles } from "./styles";

const PostCardSkeleton = () => (
  <View style={styles.root}>
    <View style={styles.authorHeader}>
      <View style={styles.avatar} />
      <View style={styles.skeletonAuthorLine} />
    </View>
    <View style={styles.skeletonCoverBlock} />
    <View style={styles.skeletonTitleLine} />
    <View style={styles.skeletonPreviewLine} />
    <View
      style={[styles.skeletonPreviewLine, styles.skeletonPreviewLineShort]}
    />
    <View style={[postMetaRowStyles.meta, { paddingHorizontal: 13 }]}>
      <View style={styles.skeletonMetaPill} />
      <View style={styles.skeletonMetaPill} />
    </View>
  </View>
);

export default PostCardSkeleton;
