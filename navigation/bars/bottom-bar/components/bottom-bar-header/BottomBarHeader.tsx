import { BrandLogoMark } from "@/components";
import { Text, View } from "react-native";
import { styles } from "./styles";
import type { BottomBarHeaderProps } from "./types";

const BottomBarHeader = ({
  title,
  onLogoLayout,
  showLogo,
}: BottomBarHeaderProps) => {
  return (
    <View style={styles.content}>
      <View style={styles.brand}>
        <View style={styles.logoSlot} onLayout={onLogoLayout}>
          <BrandLogoMark visible={showLogo} />
        </View>

        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default BottomBarHeader;
