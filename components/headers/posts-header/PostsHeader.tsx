import { IMAGES } from "@/assets/images";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { styles } from "./styles";
import type { PostsHeaderProps } from "./types";

const PostsHeader = ({ onLogoLayout, showLogo = true }: PostsHeaderProps) => {
  return (
    <View style={styles.content}>
      <View style={styles.brand}>
        <View style={styles.logoSlot} onLayout={onLogoLayout}>
          {showLogo ? (
            <Image
              source={IMAGES.LOGO}
              style={styles.logoImage}
              contentFit="contain"
            />
          ) : (
            <View style={styles.logoPlaceholder} />
          )}
        </View>

        <Text style={styles.title}>Posts</Text>
      </View>
    </View>
  );
};

export default PostsHeader;
