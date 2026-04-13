import { IMAGES } from "@/assets/images";
import { Image } from "expo-image";
import { View } from "react-native";
import { styles } from "./styles";
import type { BrandLogoMarkProps } from "./types";

const BrandLogoMark = ({ visible }: BrandLogoMarkProps) =>
  visible ? (
    <Image
      source={IMAGES.LOGO}
      style={styles.fill}
      contentFit="contain"
    />
  ) : (
    <View style={styles.fill} />
  );

export default BrandLogoMark;
